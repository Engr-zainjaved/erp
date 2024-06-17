import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Alert from "../../../components/bootstrap/Alert";
import OffCanvas, {
  OffCanvasBody,
  OffCanvasHeader,
  OffCanvasTitle,
} from "../../../components/bootstrap/OffCanvas";
import CustomButton from "../../../components/custom/CustomButton";
import { useProjectContext } from "../../../context/projectContext";
import SubHeader, { SubHeaderLeft } from "../../../layout/SubHeader/SubHeader";
import useImportExportEnableStatusApi from "../../../hooks/useImportExportEnableStatusApi";
import { findEnvironment } from "../../../common/function/branchBelongToWhichStage";
import { isBuildActive } from "../../../common/function/utilities";

const ProjectDetailSubHeader = () => {
  // @ts-ignore
  const router = useRouter();
  const [offcanvasStatus, setOffcanvasStatus] = useState(false);
  const { branchName } = useProjectContext();
  const { importExportEnableStatusApi, isEnableImportExport } = useImportExportEnableStatusApi();
  const [navUrl, setNavUrl] = useState<any>();
  const { name } = router.query;
  const { setMonitorUrl, projectData, isbuildActiveStatus, setIsbuildActiveStatus } =
    useProjectContext();

  useEffect(() => {
    if (projectData) {
      setIsbuildActiveStatus(isBuildActive(projectData));
    }
  }, [projectData]);

  let selectedProjectId: any;
  let selectedBranchId: any;
  try {
    selectedProjectId = localStorage.getItem("projectId");
    selectedBranchId = localStorage.getItem("branchId");
  } catch {
    console.error("error in accessing projectId on backups page");
  }

  useEffect(() => {
    if (selectedBranchId && selectedProjectId) {
      importExportEnableStatusApi(selectedProjectId, selectedBranchId, setNavUrl);
    }
  }, [selectedBranchId]);

  if (navUrl) {
    setMonitorUrl(navUrl.monitor_url);
  }

  const generateButtonClickHandler = (buttonText: string) => () => {
    switch (buttonText) {
      case "HISTORY":
        router.push(`/project/${name}/branches/${branchName}/history`);
        break;
      case "SHELL":
        window.open(`${navUrl.shell_url}`, "_blank");
        break;
      case "EDITOR":
        window.open(`${navUrl.editor_url}`, "_blank");
        break;
      case "MONITOR":
        router.push(`/project/${name}/branches/${branchName}/monitor`);
        break;
      case "LOGS":
        router.push(`/project/${name}/branches/${branchName}/logs`);
        break;
      case "BACKUPS":
        router.push(`/project/${name}/branches/${branchName}/backups`);
        break;
      case "UPGRADE":
        router.push(`/project/${name}/branches/${branchName}/upgrade`);
        break;
      case "SETTINGS":
        router.push(`/project/${name}/branches/${branchName}/settings`);
        break;

      default:
        break;
    }
  };

  const buttonsData = [
    "HISTORY",
    "SHELL",
    "EDITOR",
    "MONITOR",
    "LOGS",
    "BACKUPS",
    "UPGRADE",
    "SETTINGS",
  ];

  let stage: string | null;
  try {
    stage = localStorage.getItem("currentStage");
  } catch (error) {
    console.error("error in localStorage", error);
  }

  return (
    <>
      <SubHeader>
        <SubHeaderLeft>
          {buttonsData.map((buttonText, index) => (
            <CustomButton
              key={index}
              buttonText={buttonText}
              onClick={generateButtonClickHandler(buttonText)}
              disabled={
                (!isbuildActiveStatus &&
                  (buttonText === "SHELL" ||
                    buttonText === "EDITOR" ||
                    buttonText === "MONITOR" ||
                    buttonText === "LOGS")) ||
                (stage === "Development" && buttonText === "BACKUPS") ||
                ((navUrl?.shell_url === "" || navUrl?.shell_url === null) &&
                  buttonText === "SHELL") ||
                ((navUrl?.editor_url === "" || navUrl?.editor_url === null) &&
                  buttonText === "EDITOR") ||
                ((navUrl?.monitor_url === "" || navUrl?.monitor_url === null) &&
                  buttonText === "MONITOR")
              }
            />
          ))}
        </SubHeaderLeft>
      </SubHeader>

      <OffCanvas
        id="notificationCanvas"
        titleId="offcanvasExampleLabel"
        placement="end"
        isOpen={offcanvasStatus}
        setOpen={setOffcanvasStatus}
      >
        <OffCanvasHeader setOpen={setOffcanvasStatus}>
          <OffCanvasTitle id="offcanvasExampleLabel">Notifications</OffCanvasTitle>
        </OffCanvasHeader>
        <OffCanvasBody>
          <Alert icon="ViewInAr" isLight color="info" className="flex-nowrap">
            4 new components added.
          </Alert>
          <Alert icon="ThumbUp" isLight color="warning" className="flex-nowrap">
            New products added to stock.
          </Alert>
          <Alert icon="Inventory2" isLight color="danger" className="flex-nowrap">
            There are products that need to be packaged.
          </Alert>
          <Alert icon="BakeryDining" isLight color="success" className="flex-nowrap">
            Your food order is waiting for you at the consultation.
          </Alert>
          <Alert icon="Escalator" isLight color="primary" className="flex-nowrap">
            Escalator will turn off at 6:00 pm.
          </Alert>
        </OffCanvasBody>
      </OffCanvas>
    </>
  );
};

export default ProjectDetailSubHeader;
