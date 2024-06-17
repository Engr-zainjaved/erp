import { stagesInfo } from "../../../common/data/trackingHistoryData";
import { CardBody } from "../../bootstrap/Card";

interface Commit {
  identifier: string;
  provider_url: string;
  message: string;
}

interface TrackingCardBodyProps {
  trackingType?: string;
  sourceStage?: "development" | "production" | "staging";
  targetStage?: "development" | "production" | "staging";
  commits: Commit[];
}

const TrackingCardBody = ({ sourceStage, targetStage, commits }: TrackingCardBodyProps) => {
  const stage = targetStage || sourceStage;

  return (
    <>
      {stage && (
        <CardBody>
          <div>
            <span
              dangerouslySetInnerHTML={{
                __html: stagesInfo[stage].description.replace(/\n/g, "<br />"),
              }}
            />
          </div>
        </CardBody>
      )}

      {commits && commits.length != 0 && (
        <div style={{ marginBottom: "20px" }}>
          {commits.map((commit, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "2px",
                borderRadius: "15px",
                backgroundColor: "#f9f9f9",
                width: "80%",
                marginLeft: "10px",
              }}
            >
              <a
                href={commit?.provider_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <div className="d-flex justify-content-between">
                  <div>{commit?.message}</div>
                  <div>{commit?.identifier.slice(-7)}</div>
                </div>
              </a>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default TrackingCardBody;
