import { useState } from "react";
import { toast } from "react-toastify";
import request from "../common/lib/axios";

const useDownloadDatabaseDumpApi = (setDownloadDatabaseState: any) => {
  const [isLoadingDownloadDatabaseDumpApi, setIsLoadingDownloadDatabaseDumpApi] = useState(false);

  const downloadDatabaseDump = async (
    projectId: number,
    branchId: number,
    backupId: number,
    downloadType: string
  ) => {
    setIsLoadingDownloadDatabaseDumpApi(true);

    const apiUrl = `/user/project/${projectId}/branches/${branchId}/backups/${backupId}/download/`;
    const requestBody = { download_type: downloadType };

    await request
      .post(apiUrl, requestBody)
      .then((response) => {
        const fileUrl = response?.data?.data?.download_url;
        if (fileUrl) {
          const link = document.createElement("a");
          link.href = fileUrl;
          link.setAttribute("download", "");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          console.error("File URL is empty");
        }
        toast.success(response?.data?.message, { autoClose: 5000, theme: "colored" });
      })
      .finally(() => {
        setIsLoadingDownloadDatabaseDumpApi(false);
        setDownloadDatabaseState(false);
      });
  };

  return {
    downloadDatabaseDump,
    isLoadingDownloadDatabaseDumpApi,
  };
};

export default useDownloadDatabaseDumpApi;
