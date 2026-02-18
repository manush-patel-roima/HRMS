package com.company.hrms.common.util;

import com.cloudinary.Cloudinary;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(Cloudinary cloudinary){

        this.cloudinary=cloudinary;
    }

    public String uploadTravelDocument(MultipartFile file, Integer travelId, Integer employeeId) {
        try {
            Map<String, Object> options = new HashMap<>();
            options.put("folder", "hrms/travels/" + travelId + "/" + employeeId);
            options.put("resource_type", "auto");

            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), options);

            return uploadResult.get("secure_url").toString();

        } catch (Exception e) {
            throw new RuntimeException("Travel document upload failed: " + e.getMessage());
        }
    }


    public String uploadExpenseProof(MultipartFile file, Integer travelId, Integer employeeId) {
        try {
            Map<String, Object> options = new HashMap<>();
            options.put("folder", "hrms/expenses/" + travelId + "/" + employeeId);
            options.put("resource_type", "auto");

            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), options);

            return uploadResult.get("secure_url").toString();

        } catch (Exception e) {
            throw new RuntimeException("Expense proof upload failed: " + e.getMessage());
        }
    }


    public String uploadJd(MultipartFile file, String jobTitle) {
        try {
            Map<String, Object> options = new HashMap<>();
            options.put("folder", "hrms/jobs/jds/" + jobTitle );
            options.put("resource_type", "auto");

            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), options);

            return uploadResult.get("secure_url").toString();

        } catch (Exception e) {
            throw new RuntimeException("Expense proof upload failed: " + e.getMessage());
        }
    }

    public String uploadReferralCv(MultipartFile file, String friendName) {
        try {
            Map<String, Object> options = new HashMap<>();
            options.put("folder", "hrms/jobs/referrals/" + friendName );
            options.put("resource_type", "auto");

            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), options);

            return uploadResult.get("secure_url").toString();

        } catch (Exception e) {
            throw new RuntimeException("Expense proof upload failed: " + e.getMessage());
        }
    }
}
