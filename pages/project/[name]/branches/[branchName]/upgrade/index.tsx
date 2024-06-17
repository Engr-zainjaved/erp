import { useRouter } from "next/router";
import Alert from "../../../../../../components/bootstrap/Alert";
import { useProjectContext } from "../../../../../../context/projectContext";
import Page from "../../../../../../layout/Page/Page";

const ProjectUpgrade = () => {
  const { projectBranchListApiData, branchId } = useProjectContext();

  function findStageByBranchId(branchId: any) {
    for (const stageKey in projectBranchListApiData.data) {
      const stage = projectBranchListApiData.data[stageKey];

      // Check if stage has branches property
      if (stage.branches && Array.isArray(stage.branches)) {
        const foundBranch = stage.branches.find(
          (branch: any) => branch.id === branchId
        );

        if (foundBranch) {
          return stageKey;
        }
      }
    }

    return null;
  }

  const stage = findStageByBranchId(branchId);

  return (
    <Page>
      <br style={{ marginTop: "5rem" }} />

      <div className="d-flex align-items-center flex-column">
        <h2>{`Upgrade a ${stage} branch`}</h2>
        <Alert color="info" isLight>
          This project is already using the latest version which can be
          upgraded. <br />
          The upgrade to Odoo 17.0 will be available soon...
        </Alert>
      </div>
    </Page>
  );
};

export default ProjectUpgrade;
