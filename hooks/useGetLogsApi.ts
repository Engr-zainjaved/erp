import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import request from "../common/lib/axios";

const useGetLogsApi = () => {
  const [isLoadingGetLogsApi, setIsLoadingGetLogsApi] = useState(false);
  const router = useRouter();

  const getLogsApi = async (projectId: number, branchId: number, projectName: string) => {
    setIsLoadingGetLogsApi(true);

    const apiUrl = `/user/project/${projectId}/branches/${branchId}`;

    await request
      .get(apiUrl)
      .then((r) => {
        router.push(`/project/[name]`, `/project/${projectName}`).then(() => {
          router.reload();
        });
        setTimeout(() => {
          toast.success("Branch deleted Successfully", { autoClose: 5000, theme: "colored" });
        }, 3000);
      })
      .finally(() => {
        setIsLoadingGetLogsApi(false);
      });
  };

  return {
    getLogsApi,
    isLoadingGetLogsApi,
  };
};

export default useGetLogsApi;
