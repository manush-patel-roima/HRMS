package com.company.hrms.expense.service;

import com.company.hrms.common.exception.ResourceNotFoundException;
import com.company.hrms.common.exception.UnauthorizedException;
import com.company.hrms.common.exception.ValidationException;
import com.company.hrms.common.util.CloudinaryService;
import com.company.hrms.configdata.entity.StatusMaster;
import com.company.hrms.configdata.repository.StatusMasterRepository;
import com.company.hrms.configdata.service.SystemConfigService;
import com.company.hrms.employee.entity.Employee;
import com.company.hrms.employee.repository.EmployeeRepository;
import com.company.hrms.expense.dto.*;
import com.company.hrms.expense.entity.Expense;
import com.company.hrms.expense.entity.ExpenseProof;
import com.company.hrms.expense.entity.ExpenseStatusHistory;
import com.company.hrms.expense.entity.ExpenseValidationConfig;
import com.company.hrms.expense.repository.ExpenseProofRepository;
import com.company.hrms.expense.repository.ExpenseRepository;
import com.company.hrms.expense.repository.ExpenseStatusHistoryRepository;
import com.company.hrms.expense.repository.ExpenseValidationConfigRepository;
import com.company.hrms.common.service.EmailService;
import com.company.hrms.notification.NotificationSocketService;
import com.company.hrms.travel.entity.TravelPlan;
import com.company.hrms.travel.repository.TravelPlanRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class ExpenseService {

    private final ExpenseRepository expenseRepo;
    private final TravelPlanRepository travelRepo;
    private final EmployeeRepository employeeRepo;
    private final StatusMasterRepository statusRepo;
    private final ExpenseProofRepository proofRepo;
    private final ExpenseStatusHistoryRepository historyRepo;
    private final ExpenseValidationConfigRepository configRepo;
    private final CloudinaryService cloudinaryService;
    private final EmailService emailService;
    private final SystemConfigService configService;

    public ExpenseService(
            ExpenseRepository expenseRepo,
            TravelPlanRepository travelRepo,
            EmployeeRepository employeeRepo,
            StatusMasterRepository statusRepo,
            ExpenseProofRepository proofRepo,
            ExpenseStatusHistoryRepository historyRepo,
            ExpenseValidationConfigRepository configRepo,
            CloudinaryService cloudinaryService,
            EmailService emailService,
            SystemConfigService configService
    )
    {

        this.expenseRepo = expenseRepo;
        this.travelRepo = travelRepo;
        this.employeeRepo = employeeRepo;
        this.statusRepo = statusRepo;
        this.proofRepo = proofRepo;
        this.historyRepo = historyRepo;
        this.configRepo = configRepo;
        this.cloudinaryService = cloudinaryService;
        this.emailService = emailService;
        this.configService=configService;
    }


    public ExpenseDetail createDraft(
            Integer employeeId,
            Integer travelId,
            String category,
            BigDecimal amount,
            LocalDate expenseDate,
            List<MultipartFile> proofs
    )
    {

        Employee employee = employeeRepo.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found"));

        TravelPlan travel = travelRepo.findById(travelId)
                .orElseThrow(() -> new ResourceNotFoundException("Travel not found"));


        if (travel.getEmployees().stream().noneMatch(te -> te.getEmployee().getEmployeeId().equals(employee.getEmployeeId()))) {
            throw new ValidationException("You are not assigned to this travel");
        }


        if (expenseDate.isBefore(travel.getStartDate()) || expenseDate.isAfter(travel.getEndDate().plusDays(10))) {
            throw new ValidationException("Expense date must be within travel period");
        }


        ExpenseValidationConfig config = configRepo
                .findAll()
                .stream()
                .findFirst()
                .orElseThrow(() -> new ValidationException("Validation config missing"));

        if (Boolean.TRUE.equals(config.getIsCategoryMandatory()) && (category == null || category.isBlank())) {
            throw new ValidationException("Category is mandatory");
        }

        if (config.getMaxPerDayAmount() != null
                && amount.compareTo(config.getMaxPerDayAmount()) > 0) {
            throw new ValidationException("Amount exceeds allowed per-day limit");
        }

        StatusMaster draftStatus = statusRepo
                .findByModuleAndStatusCode("EXPENSE", "DRAFT")
                .orElseThrow();

        Expense expense = new Expense();
        expense.setEmployee(employee);
        expense.setTravelPlan(travel);
        expense.setCategory(category);
        expense.setAmount(amount);
        expense.setExpenseDate(expenseDate);
        expense.setStatus(draftStatus);

        expenseRepo.save(expense);


        for (MultipartFile file : proofs)
        {
            String url = cloudinaryService.uploadExpenseProof(file, travelId, employeeId);

            ExpenseProof proof = new ExpenseProof();
            proof.setExpense(expense);
            proof.setFileUrl(url);
            proof.setFileType(file.getContentType());

            proofRepo.save(proof);
            expense.getProofs().add(proof);
        }

        createHistory(expense, null, "DRAFT", employee, null);

        return mapToDetailDTO(expense);
    }




    public ExpenseDetail submitExpense(Integer expenseId, Integer employeeId)
    {

        Expense expense = expenseRepo.findById(expenseId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found"));

        if (!expense.getEmployee().getEmployeeId().equals(employeeId)) {
            throw new UnauthorizedException("Unauthorized");
        }


        if (!expense.getStatus().getStatusCode().equals("DRAFT")) {
            throw new ValidationException("Only draft expenses can be submitted");
        }


        if (expense.getProofs().isEmpty()) {
            throw new ValidationException("At least one proof is required");
        }

        StatusMaster submittedStatus = statusRepo
                .findByModuleAndStatusCode("EXPENSE", "SUBMITTED")
                .orElseThrow();

        expense.setStatus(submittedStatus);
        expense.setSubmittedAt(LocalDateTime.now());

        createHistory(expense, "DRAFT", "SUBMITTED", expense.getEmployee(), null);

        String hrEmail = configService.getConfigValue("DEFAULT_HR_EMAIL");
        emailService.sendExpenseSubmissionEmail(
                hrEmail,
                expense.getEmployee().getFullName(),
                expense.getTravelPlan().getTitle(),
                expense.getExpenseId(),
                expense.getAmount().toString()
        );

        return mapToDetailDTO(expense);
    }




    public ExpenseDetail approveExpense(Integer expenseId, Integer hrId)
    {

        Expense expense = expenseRepo.findById(expenseId)
                .orElseThrow();

        if (!expense.getStatus().getStatusCode().equals("SUBMITTED")) {
            throw new ValidationException("Only submitted expenses can be approved");
        }

        StatusMaster approved = statusRepo
                .findByModuleAndStatusCode("EXPENSE", "APPROVED")
                .orElseThrow();

        expense.setStatus(approved);
        expense.setApprovedAt(LocalDateTime.now());
        expense.setActionByHR(employeeRepo.findById(hrId).orElseThrow());

        createHistory(expense, "SUBMITTED", "APPROVED", expense.getActionByHR(), null);

        return mapToDetailDTO(expense);
    }




    public ExpenseDetail rejectExpense(Integer expenseId, Integer hrId, String remark)
    {

        if (remark == null || remark.isBlank()) {
            throw new ValidationException("Remark is mandatory");
        }

        Expense expense = expenseRepo.findById(expenseId)
                .orElseThrow();

        if (!expense.getStatus().getStatusCode().equals("SUBMITTED")) {
            throw new ValidationException("Only submitted expenses can be rejected");
        }

        StatusMaster rejected = statusRepo
                .findByModuleAndStatusCode("EXPENSE", "REJECTED")
                .orElseThrow();

        expense.setStatus(rejected);
        expense.setRejectedAt(LocalDateTime.now());
        expense.setHrRemark(remark);
        expense.setActionByHR(employeeRepo.findById(hrId).orElseThrow());

        createHistory(expense, "SUBMITTED", "REJECTED", expense.getActionByHR(), remark);

        return mapToDetailDTO(expense);
    }




//    public List<ExpenseSummary> filterExpenses(
//            Integer employeeId,
//            String status,
//            Integer travelId,
//            LocalDate from,
//            LocalDate to)
//    {
//
//        List<Expense> expenses = expenseRepo.findAll();
//
//        return expenses.stream()
//                .filter(e -> employeeId == null ||
//                        e.getEmployee().getEmployeeId().equals(employeeId))
//                .filter(e -> status == null ||
//                        e.getStatus().getStatusCode().equals(status))
//                .filter(e -> travelId == null ||
//                        e.getTravelPlan().getTravelId().equals(travelId))
//                .filter(e -> from == null ||
//                        !e.getExpenseDate().isBefore(from))
//                .filter(e -> to == null ||
//                        !e.getExpenseDate().isAfter(to))
//                .map(this::mapToSummaryDTO)
//                .toList();
//    }


    public List<ExpenseSummary> filterExpenses(
            String employeeName,
            String status,
            Integer travelId,
            LocalDate from,
            LocalDate to)
    {
        List<Expense> expenses = expenseRepo.filterExpenses(employeeName,status,travelId,from,to);

        return expenses.stream()
                .map(this::mapToSummaryDTO)
                .toList();

    }



    public List<TravelGroupedExpense> getGroupedExpenses(Integer employeeId)
    {

        List<Expense> expenses = expenseRepo.findByEmployee_EmployeeId(employeeId);

        Map<TravelPlan, List<Expense>> grouped = expenses
                .stream()
                .collect(Collectors.groupingBy(Expense::getTravelPlan));

        return grouped.entrySet().stream().map(entry -> {

            TravelPlan travel = entry.getKey();
            List<Expense> travelExpenses = entry.getValue();

            BigDecimal total = travelExpenses
                    .stream()
                    .map(Expense::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            List<ExpenseSummary> summaries =
                    travelExpenses
                            .stream()
                            .map(this::mapToSummaryDTO)
                            .toList();

            return new TravelGroupedExpense(
                    travel.getTravelId(),
                    travel.getTitle(),
                    total,
                    summaries
            );

        }).toList();
    }




    public ExpenseDetail getExpenseDetailForEmployee(Integer expenseId, Integer employeeId)
    {

        Expense expense = expenseRepo.findById(expenseId)
                .orElseThrow(()->new ResourceNotFoundException("Expense does not exists"));

        if (!expense.getEmployee().getEmployeeId().equals(employeeId)) {
            throw new UnauthorizedException("Unauthorized");
        }

        return mapToDetailDTO(expense);
    }




    public List<ExpenseSummary> getTeamExpenses(Integer managerId)
    {

        return expenseRepo
                .findByEmployee_Manager_EmployeeId(managerId)
                .stream()
                .map(this::mapToSummaryDTO)
                .toList();
    }




    public ExpenseDetail getExpenseDetailForHR(Integer expenseId)
    {

        Expense expense = expenseRepo.findById(expenseId)
                .orElseThrow(()->new ResourceNotFoundException("Expense does not exists"));

        return mapToDetailDTO(expense);
    }




    private void createHistory(Expense expense,
                               String oldStatus,
                               String newStatus,
                               Employee changedBy,
                               String remark
    )
    {

        ExpenseStatusHistory history = new ExpenseStatusHistory();
        history.setExpense(expense);
        history.setOldStatus(oldStatus != null ? oldStatus : "NEW");
        history.setNewStatus(newStatus);
        history.setChangedBy(changedBy);
        history.setRemark(remark);

        historyRepo.save(history);
    }




    private ExpenseSummary mapToSummaryDTO(Expense e)
    {
        return new ExpenseSummary(
                e.getExpenseId(),
                e.getCategory(),
                e.getAmount(),
                e.getExpenseDate(),
                e.getStatus().getStatusCode(),
                e.getTravelPlan().getTitle(),
                e.getEmployee().getFullName()
        );
    }




    private ExpenseDetail mapToDetailDTO(Expense e)
    {

        List<String> proofs = e.getProofs()
                .stream()
                .map(ExpenseProof::getFileUrl)
                .toList();

        List<StatusTimeline> timeline =
                historyRepo.findByExpense_ExpenseIdOrderByChangedAtAsc(e.getExpenseId())
                        .stream()
                        .map(h -> new StatusTimeline(
                                h.getNewStatus(),
                                h.getChangedBy().getFullName(),
                                h.getChangedAt(),
                                h.getRemark()))
                        .toList();

        return new ExpenseDetail(
                e.getExpenseId(),
                e.getEmployee().getFullName(),
                e.getTravelPlan().getTitle(),
                e.getCategory(),
                e.getAmount(),
                e.getExpenseDate(),
                e.getStatus().getStatusCode(),
                e.getHrRemark(),
                proofs,
                timeline
        );
    }

}