package com.company.hrms.travel.service;

import com.company.hrms.common.exception.BusinessRuleViolationException;
import com.company.hrms.common.exception.ForbiddenException;
import com.company.hrms.common.exception.ResourceNotFoundException;
import com.company.hrms.common.exception.ValidationException;
import com.company.hrms.common.service.EmailService;
import com.company.hrms.common.util.CloudinaryService;
import com.company.hrms.employee.entity.Employee;
import com.company.hrms.employee.repository.EmployeeRepository;
import com.company.hrms.notification.NotificationSocketService;
import com.company.hrms.travel.dto.*;
import com.company.hrms.travel.entity.TravelDocument;
import com.company.hrms.travel.entity.TravelEmployee;
import com.company.hrms.travel.entity.TravelPlan;
import com.company.hrms.travel.repository.TravelDocumentRepository;
import com.company.hrms.travel.repository.TravelEmployeeRepository;
import com.company.hrms.travel.repository.TravelPlanRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class TravelService {

    private final TravelPlanRepository travelPlanRepo;
    private final TravelEmployeeRepository travelEmployeeRepo;
    private final TravelDocumentRepository travelDocumentRepo;
    private final EmployeeRepository employeeRepo;
    private final EmailService emailService;
    private final NotificationSocketService socketService;
    private final CloudinaryService cloudinaryService;

    public TravelService(
            TravelPlanRepository travelPlanRepo,
            TravelEmployeeRepository travelEmployeeRepo,
            TravelDocumentRepository travelDocumentRepo,
            EmployeeRepository employeeRepo,
            EmailService emailService,
            NotificationSocketService socketService,
            CloudinaryService cloudinaryService

    )
    {
        this.travelPlanRepo=travelPlanRepo;
        this.travelEmployeeRepo=travelEmployeeRepo;
        this.travelDocumentRepo=travelDocumentRepo;
        this.employeeRepo=employeeRepo;
        this.emailService=emailService;
        this.socketService=socketService;
        this.cloudinaryService=cloudinaryService;
    }


    @Transactional
    public TravelResponse createTravel(CreateTravelRequest request, Integer loggedInHRId)
    {

        Employee loggedInHR = employeeRepo.findById(loggedInHRId)
                .orElseThrow(()-> new ResourceNotFoundException("HR not found"));

        if(!loggedInHR.getRole().getRoleName().equals("HR"))
        {
            throw new ForbiddenException("Only HR can create travel");
        }

        if(request.getStartDate().isAfter(request.getEndDate())){
          throw new ValidationException("Start date cannot be after end date");
        }

        List<TravelEmployee> overlappingTravels = travelEmployeeRepo.findOverlappingTravels(
                request.getEmployeeIds(),
                request.getStartDate(),
                request.getEndDate()
        );

        if(!overlappingTravels.isEmpty()){
            throw new BusinessRuleViolationException("One or more selected employees already have a travel during this period");
        }

        TravelPlan travel = new TravelPlan();
        travel.setTitle(request.getTitle());
        travel.setStartDate(request.getStartDate());
        travel.setEndDate(request.getEndDate());
        travel.setCreatedByHR(loggedInHR);

        TravelPlan savedTravel = travelPlanRepo.save(travel);

        List<Employee> employees = employeeRepo.findAllById(request.getEmployeeIds());

        for(Employee emp : employees)
        {
            TravelEmployee te = new TravelEmployee();
            te.setTravelPlan(savedTravel);
            te.setEmployee(emp);
            travelEmployeeRepo.save(te);


            emailService.sendTravelAssignmentEmail(
                    emp.getEmail(),
                    emp.getFullName(),
                    savedTravel.getTitle(),
                    savedTravel.getStartDate().toString(),
                    savedTravel.getEndDate().toString()
            );

            socketService.sendNotification(
                    emp.getEmployeeId(),
                    "New travel assigned: " + savedTravel.getTitle()
            );
        }


        return new TravelResponse(
                    savedTravel.getTravelId(),
                    savedTravel.getTitle(),
                    savedTravel.getStartDate(),
                    savedTravel.getEndDate(),
                    loggedInHR.getFullName(),
                    employees.stream()
                            .map(emp->new EmployeeSummary(
                                    emp.getEmployeeId(),
                                    emp.getFullName()
                            ))
                            .toList()
        );
    }



    public List<TravelListResponse> listTravels(Integer loggedInUserId)
    {

        Employee loggedInUser = employeeRepo.findById(loggedInUserId)
                .orElseThrow(()-> new ResourceNotFoundException("User not found"));

        String role = loggedInUser.getRole().getRoleName();

        if(role.equals("HR")){
            return travelPlanRepo
                    .findAll()
                    .stream()
                    .map(t->new TravelListResponse(
                            t.getTravelId(),
                            t.getTitle(),
                            t.getStartDate(),
                            t.getEndDate()
                    ))
                    .toList();
        }

        if(role.equals("EMPLOYEE")){
            return travelEmployeeRepo
                    .findByEmployee_EmployeeId(loggedInUserId)
                    .stream()
                    .map(te->{
                        TravelPlan t = te.getTravelPlan();
                        return new TravelListResponse(
                                t.getTravelId(),
                                t.getTitle(),
                                t.getStartDate(),
                                t.getEndDate()
                        );
                    })
                    .toList();
        }

        List<Integer> teamIds = employeeRepo
                .findByManager_EmployeeId(loggedInUserId)
                .stream()
                .map(Employee::getEmployeeId)
                .toList();

        return travelEmployeeRepo.findByEmployee_EmployeeIdIn(teamIds)
                .stream()
                .map(te->te.getTravelPlan())
                .distinct()
                .map(t-> new TravelListResponse(
                        t.getTravelId(),
                        t.getTitle(),
                        t.getStartDate(),
                        t.getEndDate()
                ))
                .toList();
    }

    @Transactional
    public TravelDocument uploadDocument(
            MultipartFile file,
            Integer travelId,
            String documentType,
            Integer employeeId,
            Integer loggedInUserId
    )
    {
        TravelPlan travel = travelPlanRepo.findById(travelId)
                .orElseThrow(()->new ResourceNotFoundException("Travel not found"));

        Employee loggedInUser = employeeRepo.findById(loggedInUserId)
                .orElseThrow(()->new ResourceNotFoundException("User not found"));

        String role = loggedInUser.getRole().getRoleName();

        Employee selectedEmployee;

        if(role.equals("HR")){
            if(employeeId == null){
                throw new ValidationException("Employee must be selected");
            }
            selectedEmployee = employeeRepo.findById(employeeId)
                    .orElseThrow(()-> new ResourceNotFoundException("Employee not found"));
        }else{
            selectedEmployee = loggedInUser;
        }
        String fileUrl = cloudinaryService.uploadTravelDocument(
                file,
                travelId,
                selectedEmployee.getEmployeeId()
        );

        TravelDocument doc = new TravelDocument();
        doc.setOwnerType(role.equals("HR") ? "HR" : "EMPLOYEE");
        doc.setDocumentType(documentType);
        doc.setFileName(file.getOriginalFilename());
        doc.setFileUrl(fileUrl);
        doc.setUploadedBy(loggedInUser);
        doc.setEmployee(selectedEmployee);
        doc.setTravelPlan(travel);

        return travelDocumentRepo.save(doc);

    }

    public TravelResponse getAssignedEmployees(Integer travelId)
    {

        TravelPlan travel = travelPlanRepo.findById(travelId)
                .orElseThrow(()-> new ResourceNotFoundException("Travel not found"));

        List<EmployeeSummary> employees = travel.getEmployees()
                .stream()
                .map(te->new EmployeeSummary(
                        te.getEmployee().getEmployeeId(),
                        te.getEmployee().getFullName()
                ))
                .toList();

        return new TravelResponse(
                travel.getTravelId(),
                travel.getTitle(),
                travel.getStartDate(),
                travel.getEndDate(),
                travel.getCreatedByHR().getFullName(),
                employees
        );
    }

    public List<TravelSummary> getAssignedTravels(Integer employeeId)
    {

        List<TravelEmployee> mappings = travelEmployeeRepo.findByEmployee_EmployeeId(employeeId);

        return mappings
                .stream()
                .map(TravelEmployee::getTravelPlan)
                .distinct()
                .map(tp->new TravelSummary(
                        tp.getTravelId(),
                        tp.getTitle()
                ))
                .toList();
    }

    public List<TravelDocumentUploadResponse> getTravelDocuments(Integer travelId, Integer loggedInUserId)
    {

        Employee loggedInUser = employeeRepo.findById(loggedInUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        TravelPlan travel = travelPlanRepo.findById(travelId)
                .orElseThrow(() -> new ResourceNotFoundException("Travel not found"));

        String role = loggedInUser.getRole().getRoleName();

        if (role.equals("HR")) {
            return travelDocumentRepo.findByTravelPlan_TravelId(travelId)
                    .stream()
                    .map(td->new TravelDocumentUploadResponse(
                            td.getDocumentId(),
                            td.getFileUrl(),
                            td.getFileName(),
                            td.getDocumentType(),
                            td.getOwnerType(),
                            td.getUploadedBy().getFullName(),
                            td.getEmployee().getFullName()
                    ))
                    .toList();
        }

        if (role.equals("EMPLOYEE")) {
            return travelDocumentRepo
                    .findByTravelPlan_TravelId(travelId)
                    .stream()
                    .filter(doc ->
                            doc.getEmployee().getEmployeeId().equals(loggedInUserId)
                    )
                    .map(td->new TravelDocumentUploadResponse(
                            td.getDocumentId(),
                            td.getFileUrl(),
                            td.getFileName(),
                            td.getDocumentType(),
                            td.getOwnerType(),
                            td.getUploadedBy().getFullName(),
                            td.getEmployee().getFullName()
                    ))
                    .toList();
        }

        List<Integer> teamIds = employeeRepo
                .findByManager_EmployeeId(loggedInUserId)
                .stream()
                .map(Employee::getEmployeeId)
                .toList();

        return travelDocumentRepo
                .findByTravelPlan_TravelId(travelId)
                .stream()
                .filter(doc ->
                        teamIds.contains(doc.getEmployee().getEmployeeId())
                )
                .map(td->new TravelDocumentUploadResponse(
                        td.getDocumentId(),
                        td.getFileUrl(),
                        td.getFileName(),
                        td.getDocumentType(),
                        td.getOwnerType(),
                        td.getUploadedBy().getFullName(),
                        td.getEmployee().getFullName()
                ))
                .toList();
    }
}
