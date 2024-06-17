import { useState } from "react";
import axios from "axios";
import request from "../common/lib/axios";
import { handleApiSuccess } from "../common/function/apiHelper/apiSuccess";
import { handleApiResponse } from "../common/function/apiHelper/apiResponse";
import useImportDatabase from "./useImportDatabase";

const useS3FileUpload = () => {
  const [isLoadinguploadFileToS3, setIsLoadinguploadFileToS3] = useState(false);
  const { importDatabase } = useImportDatabase();

  async function uploadFileToS3(
    filename: string,
    file: any,
    projectId: number,
    branchId: number,
    importType: string
  ) {
    setIsLoadinguploadFileToS3(true);
    try {
      const generateS3Url = `/user/project/${projectId}/branches/${branchId}/backups/generate_s3_url/`;
      const data = {
        filename: filename,
      };
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await request.post(generateS3Url, data, config);
      const presignedUrl = response.data.data.presigned_url;

      await axios.put(presignedUrl, file, {
        headers: { "Content-Type": file.type },
      });

      const [hostedUrl] = presignedUrl.split("?");
      importDatabase(projectId, branchId, importType, hostedUrl, filename);

      setIsLoadinguploadFileToS3(false);
    } catch (error) {
      handleApiResponse(error);
      console.error("Error uploading file:", error);
      setIsLoadinguploadFileToS3(false);
    }
  }

  return { uploadFileToS3, isLoadinguploadFileToS3 };
};

export default useS3FileUpload;
