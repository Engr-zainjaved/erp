"use client";

import React, { useContext, useEffect, useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ThemeContext from "../../../context/themeContext";
import Brand from "../../../layout/Brand/Brand";
import { NavigationLine } from "../../../layout/Navigation/Navigation";
import { useRouter } from "next/router";
import { pathToRoute } from "../../../helpers/helpers";
import Aside, { AsideBody, AsideHead } from "../../../layout/Aside/Aside";
import withOutAsideRoutes from "../../../routes/asideRoutes";

import { useFormik } from "formik";
import Button from "../../../components/bootstrap/Button";
import EnvironmentDropHandler from "../../../components/dropHandler/EnvironmentDropHandler";
import { useProjectContext } from "../../../context/projectContext";

import { handleApiSuccess } from "../../../common/function/apiHelper/apiSuccess";
import { handleWebSocketResponse } from "../../../common/function/apiHelper/webSocketResponse";
import request from "../../../common/lib/axios";
import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "../../../components/bootstrap/Modal";
import Spinner from "../../../components/bootstrap/Spinner";
import useWebSocket from "../../../hooks/useWebSocket";
import { findEnvironment } from "../../../common/function/branchBelongToWhichStage";
import DraggableListItem from "../../../components/custom/sideBar/DraggableListItem";
import { updateAllBranches } from "../../../common/function/utilities";

interface Branch {
  id: number;
  name: string;
  active: boolean;
  build: {
    url: string | null;
    status: "success" | "error" | "in_progress" | "dropped" | "";
  };
  version: string;
}

interface ApiData {
  [key: string]: {
    branches: {
      id: number;
      name: string;
      url: string | null;
      status: string;
    }[];
    id: number;
  };
}

interface Environment {
  branches: Branch[];
  id: number;
}

interface Branches {
  Production: Environment;
  Staging: Environment;
  Development: Environment;
}

interface DraggableListItem {
  branch: Branch;
  onDragEnd: any;
  onDrop: any;
  onClick: any;
  onDrag: any;
  isSelected: boolean;
}

const DefaultAside = () => {
  const { asideStatus, setAsideStatus } = useContext(ThemeContext);
  const { webSocketData } = useWebSocket();

  const {
    setProjectData,
    setBranchName,
    setProjectMessage,
    setBranchId,
    setBranchData,
    setProjectBranchListApiData,
    setWebsocketRealTimeData,
  } = useProjectContext();
  const initalState = {
    Production: { branches: [], id: 0 },
    Staging: { branches: [], id: 0 },
    Development: { branches: [], id: 0 },
  };

  const [stageId, setStageId] = useState<any>();
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
  const [draggedBranchId, setDraggedBranchId] = useState(null);
  const [targetBranchId, setTargetBranchId] = useState<any>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [branches, setBranches] = useState<ApiData>(initalState);
  const [lastBranchId, setLastBranchId] = useState(null);
  const [showStageChangeModal, setShowStageChangeModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateNewBranchLoading, setIsCreateNewBranchLoading] = useState(false);
  const [defaultBranchId, setDefaultBranchId] = useState<number>();
  const router = useRouter();
  const { name, branchName } = router.query;

  let selectedProjectId: any;
  let selectedBranchId: any;
  try {
    selectedProjectId = localStorage.getItem("projectId");
    selectedBranchId = localStorage.getItem("branchId");
  } catch (error) {
    console.error("error in localStorage", error);
  }

  useEffect(() => {
    if (branches) {
      let stage = findEnvironment(selectedBranchId, branches);
      if (stage) {
        localStorage.setItem("currentStage", stage);
      }
    }
  }, [selectedBranchId, branches]);

  useEffect(() => {
    return () => {
      localStorage.removeItem("branchId");
    };
  }, []);

  useEffect(() => {
    // Iterate through each environment
    for (const environment in branches) {
      if (branches.hasOwnProperty(environment)) {
        // Check if branches exist for the environment
        const environmentBranches = branches[environment].branches;
        if (environmentBranches.length > 0) {
          // Assuming the default branch is the first one
          const currentId = environmentBranches[0].id;
          setDefaultBranchId(currentId);
          return; // Stop iteration once default branch is found
        }
      }
    }
  }, [branches]);

  useEffect(() => {
    formik.setValues((prevValues: any) => ({
      ...prevValues,
      existingBranchName: defaultBranchId,
    }));
  }, [defaultBranchId]);

  const getBranchesFromEnvironment = (environment: keyof Branches): any[] => {
    if (branches && branches[environment]) {
      return branches[environment]?.branches || [];
    } else {
      return [];
    }
  };

  const allBranches = [
    ...getBranchesFromEnvironment("Production"),
    ...getBranchesFromEnvironment("Staging"),
    ...getBranchesFromEnvironment("Development"),
  ];

  const handleItemClick = (itemId: number) => {
    setBranchId(itemId);
    setSelectedItems([itemId]);
  };

  const handleEnvironmentChange = (environmentId: any) => {
    setStageId(environmentId);
  };

  const formik = useFormik({
    initialValues: {
      newBranchName: "",
      existingBranchName: defaultBranchId,
      selectedEnvironment: "",
    },
    onSubmit: (values: any, { resetForm }) => {
      createBranch(values);
      resetForm();
    },
  });

  const stageChange = (draggedBranchId: any, targetBranchId: any) => {
    setIsLoading(true);
    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/user/project/${selectedProjectId}/branches/${draggedBranchId}/`;

    request
      .patch(apiUrl, { stage: targetBranchId })
      .then((response) => {
        handleApiSuccess(response);
        return updateStateAfterBranchCreation();
      })
      .finally(() => {
        setShowStageChangeModal(false);
        setIsLoading(false);
      });
  };

  const createBranch = (values: any) => {
    setIsCreateNewBranchLoading(true);
    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/user/project/${selectedProjectId}/branches/`;

    request
      .post(apiUrl, {
        name: values.newBranchName.toString(),
        base_branch: values.existingBranchName,
        stage: values.selectedEnvironment,
      })
      .then((response) => {
        handleApiSuccess(response);
        return updateStateAfterBranchCreation();
      })
      .finally(() => {
        setIsCreateNewBranchLoading(false);
      });
  };

  const fetchBranchHistory = (branchId: number, listBranchName: string) => {
    setProjectData(null);
    setIsLoading(true);

    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/user/project/${selectedProjectId}/branches/${branchId}/tracking/`;

    request
      .get(apiUrl)
      .then((response) => {
        setProjectData(response.data.data);
        setProjectMessage(response.data.message);
        setBranchName(listBranchName);
        setSelectedItems([branchId]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const mergeBranch = (draggedBranchId: any, targetBranchId: any) => {
    setIsLoading(true);
    setDraggedBranchId(draggedBranchId);
    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/user/project/${selectedProjectId}/branches/merge/`;

    request
      .post(apiUrl, {
        target_branch: targetBranchId,
        source_branch: draggedBranchId,
      })
      .then((response) => {
        handleApiSuccess(response);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleMerge = async (draggedBranchId: any, targetBranchId: any) => {
    if (draggedBranchId && targetBranchId) {
      await mergeBranch(draggedBranchId, targetBranchId);
      setIsMergeModalOpen(false);
      setDraggedBranchId(null);
      setTargetBranchId(null);
    }
  };

  const updateStateAfterBranchCreation = async () => {
    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/user/project/${selectedProjectId}/branches/`;

    return request
      .get(apiUrl)
      .then((response) => {
        setProjectBranchListApiData(response);
        setBranchData(response);
        const data = response.data.data;
        if (Object.keys(data).length === 0) {
          localStorage.setItem("errorMessage", `${response.data.message}`);
          router.push("/project");
        } else {
          setBranches(data);
          setStageId(data.Development.id);
        }
      })
      .catch((error) => {
        if (
          error &&
          error.data &&
          error.data.errors &&
          error.data.errors[0] === "No Project matches the given query."
        ) {
          localStorage.setItem("errorMessage", `${"No Project matches the given query."}`);
          router.push("/project");
        }
      });
  };

  function updateBranchOnWebSocketData(webSocketData: any, currentBranches: any) {
    const { type } = webSocketData;
    if (type === "branch_added" && currentBranches !== initalState) {
      const { branch, tracking } = webSocketData;
      const { id, name, stage } = branch;
      const { build } = tracking;
      const newBranchObject = {
        id: id,
        name: name,
        active: build?.is_active,
        build: build,
        version: "",
      };

      // Check if the branch already exists in the current branches state
      const existingBranch = currentBranches[stage.name]?.branches.find(
        (branch: any) => branch.id === id
      );

      if (!existingBranch && currentBranches !== initalState) {
        // Update the state by creating a new object (immutable update)
        setBranches((prevBranches) => ({
          ...prevBranches,
          [stage.name]: {
            ...prevBranches[stage.name],
            branches: [...(prevBranches[stage.name]?.branches || []), newBranchObject],
          },
        }));
      }
    } else if (type === "branch_deleted" && currentBranches !== initalState) {
      const { id, stage } = webSocketData.data;

      // Update the state by removing the branch with the specified id
      setBranches((prevBranches: any) => ({
        ...prevBranches,
        [stage?.name]: {
          ...prevBranches[stage?.name],
          branches: prevBranches[stage?.name]?.branches?.filter((branch: any) => branch?.id !== id),
        },
      }));
    }
  }

  function updateSideBarBranchStatus(webSocketBranchUpdateData: any, currentBranches: any) {
    const { type } = webSocketData;

    if (type === "branch_updated") {
      const { branch_id, tracking } = webSocketBranchUpdateData;
      let branchIdToUpdate = branch_id;
      let buildObject = tracking.build;
      const updatedCurrentBranches = updateAllBranches(
        branchIdToUpdate,
        buildObject,
        currentBranches
      );
      setBranches(updatedCurrentBranches);
    }

    if (
      type === "build_succeed" ||
      type === "build_failed" ||
      type === "build_dropped" ||
      type === "build_event" ||
      type === "backup_failed"
    ) {
      const { branch_id, build } = webSocketBranchUpdateData;
      let branchIdToUpdate = branch_id;
      let buildObject = build;
      const updatedCurrentBranches = updateAllBranches(
        branchIdToUpdate,
        buildObject,
        currentBranches
      );
      setBranches(updatedCurrentBranches);
    }
  }

  useEffect(() => {
    if (webSocketData) {
      const eventType = webSocketData.type;
      const eventMessage = webSocketData.message;

      handleWebSocketResponse(webSocketData);

      updateSideBarBranchStatus(webSocketData, branches);
      setWebsocketRealTimeData(webSocketData);

      if (
        (eventType === "branch_added" || eventType === "branch_deleted") &&
        webSocketData.branch_id !== lastBranchId
      ) {
        updateBranchOnWebSocketData(webSocketData, branches);
        setLastBranchId(webSocketData.branch_id);
      }

      if (eventType === "download_ready") {
        const url = webSocketData.download_url;
        toast.success(
          <>
            {eventMessage}
            <br />
            <Button color="success" onClick={() => window.open(url, "_blank")}>
              Download
            </Button>
          </>,
          { autoClose: false, closeOnClick: false, draggable: false }
        );
      }
    }
  }, [webSocketData]);

  useEffect(() => {
    if (selectedProjectId) {
      updateStateAfterBranchCreation();
    }
  }, [selectedProjectId]);

  useEffect(() => {
    const allowedPaths = [`/project/${name}/branches/${branchName}/history`, `/project/${name}`];

    // Function to check if the current route matches allowed paths
    const isAllowedRoute = () => {
      const currentPath = router.asPath;
      return allowedPaths.includes(currentPath);
    };

    const findFirstBranch = (environment: keyof Branches) => {
      const environmentBranches = branches[environment].branches;
      if (environmentBranches.length > 0 && isAllowedRoute()) {
        const firstBranchId: any = environmentBranches[0].id;
        const firstBranchName = environmentBranches[0].name;
        localStorage.setItem("branchId", firstBranchId);
        fetchBranchHistory(firstBranchId, firstBranchName);
        setBranchName(firstBranchName);
        setSelectedItems([firstBranchId]);
        return true;
      }
      return false;
    };

    const result = allBranches.find((item) => item.name === branchName);
    setBranchId(result?.id);

    if (branchName && isAllowedRoute()) {
      if (result) {
        const firstBranchId = result.id;
        const firstBranchName = result.name;
        setBranchId(firstBranchId);
        if (firstBranchId && firstBranchName) {
          localStorage.setItem("branchId", firstBranchId);
          fetchBranchHistory(firstBranchId, firstBranchName);
        }
      } else {
        console.warn("Branch not found:", branchName);
      }
    } else {
      const developmentBranchesExist = findFirstBranch("Development");
      const stagingBranchesExist = !developmentBranchesExist && findFirstBranch("Staging");
      const productionBranchesExist =
        !developmentBranchesExist && !stagingBranchesExist && findFirstBranch("Production");
    }
  }, [branches, branchName, router.asPath]);

  const DropZone = ({ onDrop }: { onDrop: any }) => {
    const [{ isOver }, drop] = useDrop({
      accept: "LIST_ITEM",
      drop: (item: any) => {
        setShowStageChangeModal(true);
        onDrop(item.branchId);
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    });

    return (
      <div
        ref={drop}
        style={{
          background: isOver ? "lightgray" : "white",
          margin: "5px 0",
        }}
        className="d-flex align-items-center"
      >
        <span
          style={{
            color: "black",
            marginLeft: "15px",
            fontSize: "17px",
            fontWeight: "bold",
            height: "60px",
          }}
          className="d-flex align-items-center"
        >
          Production
        </span>
      </div>
    );
  };

  if (withOutAsideRoutes.find((key) => key.path === pathToRoute(router.pathname))) {
    return null;
  }

  return (
    <Aside>
      <ToastContainer />
      <AsideHead>
        <Brand asideStatus={asideStatus} setAsideStatus={setAsideStatus} />
      </AsideHead>
      {asideStatus && (
        <AsideBody>
          <NavigationLine />

          <DropZone
            onDrop={(branchId: any) => {
              setDraggedBranchId(branchId);
            }}
          />

          {branches &&
            typeof branches === "object" &&
            Object.keys(branches).map((environment, index) => (
              <React.Fragment key={environment}>
                {environment !== "Production" && (
                  <EnvironmentDropHandler
                    key={environment}
                    environment={environment}
                    environmentId={branches[environment as keyof Branches].id}
                    allBranches={allBranches}
                    onDrop={(branchId: number) =>
                      stageChange(branchId, branches[environment as keyof Branches].id)
                    }
                    formik={formik}
                    stageChange={stageChange}
                    onEnvironmentChange={handleEnvironmentChange}
                    isLoading={isLoading}
                    isCreateNewBranchLoading={isCreateNewBranchLoading}
                  />
                )}
                <div style={{ cursor: "pointer" }}>
                  {branches[environment as keyof Branches]?.branches?.map((branch: any) => (
                    <DraggableListItem
                      key={branch.id}
                      branch={branch}
                      currentStatus={branch?.build?.status}
                      isSelected={selectedItems.includes(branch.id)}
                      onDragEnd={(draggedBranchId: any) => {
                        setDraggedBranchId(draggedBranchId);
                        setTargetBranchId(branch.id);
                        setIsMergeModalOpen(true);
                      }}
                      onDrop={(droppedBranchId: any) => {
                        setDraggedBranchId(droppedBranchId);
                        setTargetBranchId(branch.id);
                        setIsMergeModalOpen(true);
                      }}
                      onClick={() => {
                        handleItemClick(branch.id);
                        localStorage.setItem("branchId", branch.id);
                        router.push(`/project/${name}/branches/${branch.name}/history`);
                      }}
                      onDrag={(draggedBranchId: any) => {
                        setDraggedBranchId(draggedBranchId);
                        setTargetBranchId(branch.id);
                        setIsMergeModalOpen(true);
                      }}
                    />
                  ))}
                </div>
              </React.Fragment>
            ))}
        </AsideBody>
      )}
      <>
        <Modal
          id="{String}"
          titleId="{String}"
          isOpen={isMergeModalOpen}
          setIsOpen={setIsMergeModalOpen}
          isStaticBackdrop={true}
          isScrollable={false}
          isCentered={false}
          size="lg"
          fullScreen="md"
          isAnimation={true}
        >
          <ModalHeader className="{String}" setIsOpen={setIsMergeModalOpen}>
            <ModalTitle id="{String}">Are you sure you want to merge?</ModalTitle>
          </ModalHeader>
          <ModalBody className="{String}">
            "Rebase and Merge" will create a pull request and merge it with the rebase option for a
            linear history. "Merge" will create a merge commit, no fast forward. (The resulting code
            will be the same. More info.)
          </ModalBody>
          <ModalFooter className="{String}">
            <Button
              color="danger"
              isLight
              onClick={() => {
                setIsMergeModalOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              color="success"
              onClick={() => {
                handleMerge(draggedBranchId, targetBranchId);
              }}
            >
              {isLoading ? <Spinner size="1.2rem" /> : "Merge"}
            </Button>
          </ModalFooter>
        </Modal>

        <Modal
          id="{String}"
          titleId="{String}"
          isOpen={showStageChangeModal}
          setIsOpen={setShowStageChangeModal}
          isStaticBackdrop={true}
          isScrollable={false}
          isCentered={false}
          size="lg"
          fullScreen="md"
          isAnimation={true}
        >
          <ModalHeader className="{String}">
            <ModalTitle id="{String}">Are you sure you want to Change Stage?</ModalTitle>
          </ModalHeader>
          <ModalBody className="{String}">
            Before using Staging branches, you need to setup your production branch by Drag &
            Dropping a branch to Production. Staging branches are used to test your new features,
            with the production data.
          </ModalBody>
          <ModalFooter className="{String}">
            <Button
              color="danger"
              isLight
              onClick={() => {
                setShowStageChangeModal(false);
              }}
            >
              Cancel
            </Button>
            <Button
              color="success"
              onClick={() => {
                stageChange(draggedBranchId, branches.Production.id);
              }}
            >
              {isLoading ? <Spinner size="1.2rem" /> : "Stage Change"}
            </Button>
          </ModalFooter>
        </Modal>
      </>
    </Aside>
  );
};

export default DefaultAside;
