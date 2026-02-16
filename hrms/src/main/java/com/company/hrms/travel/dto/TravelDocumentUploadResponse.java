package com.company.hrms.travel.dto;

import lombok.*;

@Getter@Setter
@AllArgsConstructor
public class TravelDocumentUploadResponse {

    private Integer documentId;
    private String fileUrl;
    private String fileName;
    private String documentType;
    private String ownerType;

}
