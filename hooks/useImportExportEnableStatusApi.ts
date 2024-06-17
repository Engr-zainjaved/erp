import { useState } from "react";
import request from "../common/lib/axios";

const useImportExportEnableStatusApi = () => {
  const [isLoadingImportExportEnableStatusApi, setIsLoadingImportExportEnableStatusApi] =
    useState(false);
  const [isEnableImportExport, setIsEnableImportExport] = useState(false);

  const importExportEnableStatusApi = (projectId: number, branchId: number, cb?: any) => {
    setIsLoadingImportExportEnableStatusApi(true);

    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/user/project/${projectId}/branches/${branchId}/meta`;

    request
      .get(apiUrl)
      .then((response) => {
        setIsEnableImportExport(response.data.enable_restore_and_import);
        cb && cb(response.data);
      })
      .finally(() => {
        setIsLoadingImportExportEnableStatusApi(false);
      });
  };

  return {
    isEnableImportExport,
    importExportEnableStatusApi,
    isLoadingImportExportEnableStatusApi,
  };
};

export default useImportExportEnableStatusApi;
