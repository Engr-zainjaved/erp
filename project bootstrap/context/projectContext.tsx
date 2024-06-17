import React, { ReactNode, createContext, useContext, useState } from "react";

const ProjectContext = createContext<any>(null);

interface ProjectProviderProps {
  children: ReactNode;
}

type GitHubAuthTokenType = string | null;

interface UpdataedProjectCardData {
  commit: {
    title: string;
    message: string;
    url: string;
    committer: {
      name: string;
      username: string;
      avatar: string;
    };
    author: {
      name: string;
      username: string;
      avatar: string;
    };
  };
  date_created: string;
  build: {
    id: number;
    status: string;
    url: string | null;
    active: boolean;
  };
  branch: {
    id: number;
    name: string;
  };
  project: {
    id: number;
    name: string;
  };
  hash: string;
  source: string;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const [projectData, setProjectData] = useState<any>(null);
  const [branchName, setBranchName] = useState<any>(null);
  const [projectMessage, setProjectMessage] = useState<any>(null);
  const [updatedBuildData, setUpdatedBuildData] = useState<any>(null);
  const [id, setId] = useState<any>(null);
  const [branchId, setBranchId] = useState<number>();
  const [branchData, setBranchData] = useState<any>([]);
  const [projectBranchListApiData, setProjectBranchListApiData] = useState<any>([]);
  const [gitHubauthToken, setGitHubAuthToken] = useState<GitHubAuthTokenType>(null);
  const [forDetailProjectId, SetForDetailProjectId] = useState<number | null>(null);
  const [websocketRealTimeData, setWebsocketRealTimeData] = useState(null);
  const [monitorUrl, setMonitorUrl] = useState("");
  const [isbuildActiveStatus, setIsbuildActiveStatus] = useState(false);

  return (
    <ProjectContext.Provider
      value={{
        projectData,
        setProjectData,
        branchName,
        setBranchName,
        projectMessage,
        setProjectMessage,
        id,
        setId,
        branchId,
        setBranchId,
        branchData,
        setBranchData,
        projectBranchListApiData,
        setProjectBranchListApiData,
        gitHubauthToken,
        setGitHubAuthToken,
        updatedBuildData,
        setUpdatedBuildData,
        forDetailProjectId,
        SetForDetailProjectId,
        setWebsocketRealTimeData,
        websocketRealTimeData,
        monitorUrl,
        setMonitorUrl,
        isbuildActiveStatus,
        setIsbuildActiveStatus,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProjectContext must be used within a ProjectProvider");
  }
  return context;
};
