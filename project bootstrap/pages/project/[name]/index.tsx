import { useEffect, useState } from "react";
import Card, { CardBody } from "../../../components/bootstrap/Card";

import { updateStatus } from "../../../common/function/utilities";
import request from "../../../common/lib/axios";
import Spinner from "../../../components/bootstrap/Spinner";
import TrackingCard from "../../../components/custom/trackingCard/TrackingCard";
import { useProjectContext } from "../../../context/projectContext";
import Page from "../../../layout/Page/Page";

const ProjectDetail = () => {
  const { branchName, websocketRealTimeData, projectData, setProjectData } = useProjectContext();
  // const [projectData, setProjectData] = useState([]);
  const [projectMessage, setProjectMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  let selectedProjectId: any;
  let selectedBranchId: any;
  try {
    selectedProjectId = localStorage.getItem("projectId");
    selectedBranchId = localStorage.getItem("branchId");
  } catch (error) {
    console.error("error in localStorage", error);
  }

  useEffect(() => {
    setIsLoading(true);
    if (selectedProjectId && selectedBranchId) {
      const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/user/project/${selectedProjectId}/branches/${selectedBranchId}/tracking/`;

      request
        .get(apiUrl)
        .then((response) => {
          setProjectData(response.data.data);
          setProjectMessage(response.data.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [selectedBranchId]);

  useEffect(() => {
    if (projectData && projectData.length > 0) {
      const updatedApiData = updateStatus(projectData, websocketRealTimeData, selectedBranchId);
      setProjectData(updatedApiData);
    }
  }, [websocketRealTimeData]);

  return (
    <>
      <Page>
        {projectData && projectData.length > 0 ? (
          <>
            <div className="d-flex justify-content-between align-items-center">
              <h1>{branchName} Details</h1>
            </div>
            <div className="row">
              <div className="col-xl-12">
                <Card>
                  <CardBody>
                    {projectData ? (
                      <div className="row g-4">
                        <div className="col-lg-12">
                          {projectData.map((item: any, index: any) => {
                            return <TrackingCard key={index} item={item} />;
                          })}
                          {projectMessage === "No history available for this branch." && (
                            <>{projectMessage}</>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div>No Project Data Found</div>
                    )}
                    {isLoading && <Spinner size="1.2rem" />}
                  </CardBody>
                </Card>
              </div>
            </div>
          </>
        ) : (
          <div className="d-flex align-items-center justify-content-center">
            <Spinner tag="span" color="dark" size={"3rem"} />
          </div>
        )}
      </Page>
    </>
  );
};

export default ProjectDetail;
