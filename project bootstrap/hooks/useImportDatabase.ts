import { useState } from "react";
import request from "../common/lib/axios";
import { handleApiSuccess } from "../common/function/apiHelper/apiSuccess";

const useImportDatabase = () => {
  const [isLoadingImportDatabase, setIsLoadingImportDatabase] = useState(false);

  const importDatabase = async (
    projectId: number,
    branchId: number,
    importType: string,
    url?: string,
    filename?: string
  ) => {
    setIsLoadingImportDatabase(true);

    const apiUrl = `/user/project/${projectId}/branches/${branchId}/backups/import_database/`;

    const body = {
      import_type: importType,
      filename: importType === "local_file" ? filename : "",
      hosted_url: url,
    };

    await request
      .post(apiUrl, body)
      .then((r) => {
        handleApiSuccess(r);
      })
      .finally(() => {
        setIsLoadingImportDatabase(false);
      });
  };

  return {
    importDatabase,
    isLoadingImportDatabase,
  };
};

export default useImportDatabase;
