import { calculateTimeAgoUTC } from "../../../common/function/utilities";
import Card, { CardHeader, CardLabel, CardTitle } from "../../bootstrap/Card";
import CustomCardAction from "./TrackingCardAction";
import CustomCardBody from "./TrackingCardBody";
import CustomCardSubtitle from "./TrackingCardSubtitle";

const TrackingCard = ({ item }: { item: any }) => {
  return (
    <Card shadow="sm" className="mb-3">
      <CardHeader>
        <CardLabel>
          <CardTitle>
            <img
              src={item?.pusher_avatar_url || ""}
              alt={item?.pusher_name || ""}
              style={{
                width: "30px",
                height: "30px",
                cursor: "pointer",
                borderRadius: "50%",
                objectFit: "cover",
                marginRight: "5px",
              }}
            />
            <a
              href={item?.pusher_url}
              target="_blank"
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
              onMouseOver={(e) => (e.currentTarget.style.textDecoration = "underline")}
              onMouseOut={(e) => (e.currentTarget.style.textDecoration = "none")}
            >
              {item?.pusher_name ? item.pusher_name : ""}
            </a>
            <small style={{ marginLeft: "5px" }}>{calculateTimeAgoUTC(item?.date_created)}</small>
          </CardTitle>
          <CustomCardSubtitle
            trackingType={item.tracking_type}
            sourceStage={item.source_stage}
            targetStage={item.target_stage}
          />
        </CardLabel>

        <CustomCardAction
          status={item?.build?.status}
          buildId={item?.build?.id}
          buildUrl={item?.build?.url}
          errorMessage={item?.build?.error_message}
        />
      </CardHeader>
      <CustomCardBody
        sourceStage={item.source_stage}
        targetStage={item.target_stage}
        commits={item.commits}
      />
    </Card>
  );
};

export default TrackingCard;
