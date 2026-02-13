package com.company.hrms.expense.service;

import com.company.hrms.common.exception.ResourceNotFoundException;
import com.company.hrms.common.exception.UnauthorizedException;
import com.company.hrms.common.exception.ValidationException;
import com.company.hrms.common.util.CloudinaryService;
import com.company.hrms.configdata.entity.StatusMaster;
import com.company.hrms.configdata.repository.StatusMasterRepository;
import com.company.hrms.employee.entity.Employee;
import com.company.hrms.employee.repository.EmployeeRepository;
import com.company.hrms.expense.dto.CreateExpenseRequest;
import com.company.hrms.expense.dto.ExpenseListResponse;
import com.company.hrms.expense.dto.ExpenseResponse;
import com.company.hrms.expense.dto.UpdateExpenseStatusRequest;
import com.company.hrms.expense.entity.Expense;
import com.company.hrms.expense.entity.ExpenseProof;
import com.company.hrms.expense.repository.ExpenseProofRepository;
import com.company.hrms.expense.repository.ExpenseRepository;
import com.company.hrms.notification.NotificationSocketService;
import com.company.hrms.travel.entity.TravelPlan;
import com.company.hrms.travel.repository.TravelPlanRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepo;
    private final ExpenseProofRepository proofRepo;
    private final TravelPlanRepository travelRepo;
    private final StatusMasterRepository statusRepo;
    private final CloudinaryService cloudinaryService;
//    private final EmailService emailService;
    private final NotificationSocketService socketService;
    private final EmployeeRepository employeeRepository;

    public ExpenseService(
            ExpenseRepository expenseRepo,
            ExpenseProofRepository proofRepo,
            TravelPlanRepository travelRepo,
            StatusMasterRepository statusRepo,
            CloudinaryService cloudinaryService,
//            EmailService emailService,
            NotificationSocketService socketService,
            EmployeeRepository employeeRepository)
    {
        this.expenseRepo=expenseRepo;
        this.proofRepo=proofRepo;
        this.travelRepo=travelRepo;
        this.statusRepo=statusRepo;
        this.cloudinaryService=cloudinaryService;
//        this.emailService=emailService;
        this.socketService=socketService;
        this.employeeRepository = employeeRepository;
    }

    @Transactional
    public ExpenseResponse createExpense(CreateExpenseRequest request, MultipartFile proofFile, Integer loggedInUserId) {

        Employee loggedInUser = employeeRepository.findById(loggedInUserId)
                .orElseThrow(()->new ResourceNotFoundException("User not found"));

        if(!loggedInUser.getRole().getRoleName().equals("EMPLOYEE")){
            throw new UnauthorizedException("Only employees can add expenses");
        }

        TravelPlan travel = travelRepo.findById(request.getTravelId())
                .orElseThrow(()->new ResourceNotFoundException("Travel not found"));


        LocalDate today = LocalDate.now();
        if(today.isBefore(travel.getStartDate()) || today.isAfter(travel.getEndDate().plusDays(10))){
            throw new ValidationException("Expense submission window closed");
        }

        if(proofFile == null){
            throw new ValidationException("Proof document is mandatory");
        }

        StatusMaster draftStatus = statusRepo.findByModuleAndStatusCode("EXPENSE", "SUBMITTED")
                .orElseThrow(()->new ResourceNotFoundException("Status code does not exists"));


        Expense expense = new Expense();
        expense.setTravelPlan(travel);
        expense.setEmployee(loggedInUser);
        expense.setCategory(request.getCategory());
        expense.setAmount(request.getAmount());
        expense.setExpenseDate(request.getExpenseDate());
        expense.setStatus(draftStatus);

        Expense saved = expenseRepo.save(expense);

        String fileUrl = cloudinaryService.uploadExpenseProof(proofFile,request.getTravelId(),loggedInUserId);

        ExpenseProof proof = new ExpenseProof();
        proof.setExpense(saved);
        proof.setFileUrl(fileUrl);
        proofRepo.save(proof);

        saved.setProofs(List.of(proof));

//        emailService.sendTravelAssignmentMail(
//                "hr@company.com",
//                "HR",
//                "New Expense Submitted",
//                "",
//                ""
//        );

        socketService.sendNotification(
                1,"New expense submitted by " + loggedInUser.getFullName()
        );

        return mapToResponse(saved);

    }


    public ExpenseListResponse listExpenses(Integer loggedInUserId){

        Employee loggedInUser = employeeRepository.findById(loggedInUserId)
                .orElseThrow(()->new ResourceNotFoundException("User not found"));

        String role = loggedInUser.getRole().getRoleName();

        List<Expense> expenses;

        if(role.equals("EMPLOYEE")){
            expenses = expenseRepo.findByEmployee_EmployeeId(loggedInUserId);
        } else if (role.equals("MANAGER")) {
            expenses = expenseRepo.findByEmployee_Manager_EmployeeId(loggedInUserId);
        } else if (role.equals("HR")){
            expenses = expenseRepo.findAll();
        } else {
            expenses=List.of();
        }

        return (ExpenseListResponse) expenses.stream()
                .map(e->new ExpenseListResponse(
                        e.getExpenseId(),
                        e.getTravelPlan().getTitle(),
                        e.getAmount(),
                        e.getStatus().getStatusCode()
                ))
                .collect(Collectors.toList());

    }


    @Transactional
    public ExpenseResponse updateStatus(Integer expenseId, UpdateExpenseStatusRequest request, Integer loggedInUserId){

        Employee loggedInUser = employeeRepository.findById(loggedInUserId)
                .orElseThrow(()->new ResourceNotFoundException("User not found"));

        if(!loggedInUser.getRole().getRoleName().equals("HR")){
            throw new UnauthorizedException("Only HR can update status");
        }

        Expense expense = expenseRepo.findById(expenseId)
                .orElseThrow(()->new ResourceNotFoundException("Expense not found"));

        StatusMaster newStatus = statusRepo.findByModuleAndStatusCode("EXPENSE", request.getStatusCode())
                .orElseThrow(()->new ResourceNotFoundException("Wrong status code"));

        if(request.getStatusCode().equals("REJECTED") && (request.getRemark() == null || request.getRemark().isBlank())){
            throw new ValidationException("Remark required");
        }

        expense.setStatus(newStatus);
        expense.setHrRemark(request.getRemark());
        expense.setActionByHR(loggedInUser);

        expenseRepo.save(expense);

        socketService.sendNotification(
                expense.getEmployee().getEmployeeId(),
                "Expense " + request.getStatusCode()
        );

        return mapToResponse(expense);

    }


    private ExpenseResponse mapToResponse(Expense expense){
        List<String> proofs = expense.getProofs()
                .stream()
                .map(ExpenseProof::getFileUrl)
                .toList();

        return new ExpenseResponse(
                expense.getExpenseId(),
                expense.getEmployee().getFullName(),
                expense.getTravelPlan().getTitle(),
                expense.getCategory(),
                expense.getAmount(),
                expense.getExpenseDate(),
                expense.getStatus().getStatusCode(),
                expense.getHrRemark(),
                proofs
        );
    }
}
