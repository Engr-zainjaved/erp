import { useState } from "react";
import { toast } from "react-toastify";
import request from "../common/lib/axios";

const useRestoreBackup = () => {
  const [isLoadingRestoreBackup, setIsLoadingRestoreBackup] = useState(false);

  const restoreBackup = async (
    projectId: number,
    branchId: number,
    backupId: number,
    neutralizeDatabase: boolean
  ) => {
    setIsLoadingRestoreBackup(true);

    const apiUrl = `/user/project/${projectId}/branches/${branchId}/backups/${backupId}/restore/`;
    const requestBody = { neutralize_database: neutralizeDatabase };

    await request
      .post(apiUrl, requestBody)
      .then((r) => {
        toast.success("Backup restore Successfully", { autoClose: 5000, theme: "colored" });
      })
      .finally(() => {
        setIsLoadingRestoreBackup(false);
      });
  };

  return {
    restoreBackup,
    isLoadingRestoreBackup,
  };
};

export default useRestoreBackup;
