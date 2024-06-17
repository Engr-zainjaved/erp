import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import request from "../common/lib/axios";

const useDeleteProjectBranch = () => {
  const [isLoadingDeleteProjectBranch, setIsLoadingDeleteProjectBranch] = useState(false);
  const router = useRouter();

  const deleteProjectBranch = async (projectId: number, branchId: number, projectName: string) => {
    setIsLoadingDeleteProjectBranch(true);

    const apiUrl = `/user/project/${projectId}/branches/${branchId}`;

    await request
      .delete(apiUrl)
      .then((r) => {
        router.push(`/project/[name]`, `/project/${projectName}`).then(() => {
          localStorage.removeItem("branchId");
          router.reload();
        });
        setTimeout(() => {
          toast.success("Branch deleted Successfully", { autoClose: 5000, theme: "colored" });
        }, 3000);
      })
      .finally(() => {
        setIsLoadingDeleteProjectBranch(false);
      });
  };

  return {
    deleteProjectBranch,
    isLoadingDeleteProjectBranch,
  };
};

export default useDeleteProjectBranch;
