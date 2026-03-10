package com.company.hrms.common.util;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.company.hrms.common.exception.ExternalServiceException;

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
            throw new ExternalServiceException("Travel document upload failed: " + e.getMessage(), e);
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
            throw new ExternalServiceException("Expense proof upload failed: " + e.getMessage(), e);
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
            throw new ExternalServiceException("Job JD upload failed: " + e.getMessage(), e);
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
            throw new ExternalServiceException("Referral CV upload failed: " + e.getMessage(), e);
        }
    }

    public void deleteTravelDocument(String fileUrl) {

        try {
            String publicId = extractPublicId(fileUrl);
            cloudinary.uploader().destroy(publicId, ObjectUtils.asMap(
                    "resource_type", "image",
                    "invalidate", true
            ));

//            String folderPath = publicId.substring(0, publicId.lastIndexOf('/'));
//            cloudinary.api().deleteFolder(folderPath, ObjectUtils.emptyMap());

        } catch (Exception e) {
            throw new ExternalServiceException("Travel document deletion failed: " + e.getMessage(), e);
        }
    }

    private String extractPublicId(String fileUrl) {
        String publicIdWithExtension = fileUrl.split("/upload/")[1].replaceFirst("v\\d+/", "");
        return publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf('.'));

    }

    public void deleteExpenseProof(String fileUrl) {

        try {
            String publicId = extractPublicId(fileUrl);
            cloudinary.uploader().destroy(publicId, ObjectUtils.asMap(
                    "resource_type", "image",
                    "invalidate", true
            ));

//            String folderPath = publicId.substring(0, publicId.lastIndexOf('/'));
//            cloudinary.api().deleteFolder(folderPath, ObjectUtils.emptyMap());

        } catch (Exception e) {
            throw new ExternalServiceException("Expense proof deletion failed: " + e.getMessage(), e);
        }
    }

}
