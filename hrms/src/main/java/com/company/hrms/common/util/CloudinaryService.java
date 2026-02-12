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

    public String uploadFile(MultipartFile file, Integer travelId, Integer employeeId) {
        try {
            Map<String, Object> options = new HashMap<>();
            options.put("folder", "hrms/travel/" + travelId + "/" + employeeId);
            options.put("resource_type", "auto");

            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), options);

            return uploadResult.get("secure_url").toString();

        } catch (Exception e) {
            throw new RuntimeException("File upload failed: " + e.getMessage());
        }
    }
}
