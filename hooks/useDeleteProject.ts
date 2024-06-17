import { useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import request from "../common/lib/axios";

const useDeleteProject = () => {
  const [isLoadingDeleteProject, setIsLoadingDeleteProject] = useState(false);
  const router = useRouter();

  const deleteProject = async (projectId: number) => {
    setIsLoadingDeleteProject(true);

    const apiUrl = `/user/project/${projectId}/`;

    await request
      .delete(apiUrl)
      .then((r) => {
        router.push("/project");
        setTimeout(() => {
          toast.success("Project deleted Successfully", { autoClose: 5000, theme: "colored" });
        }, 1000);
      })
      .finally(() => {
        setIsLoadingDeleteProject(false);
      });
  };

  return {
    deleteProject,
    isLoadingDeleteProject,
  };
};

export default useDeleteProject;
