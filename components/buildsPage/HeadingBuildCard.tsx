import { AnyCnameRecord } from "dns";
import Card, { CardBody, CardLabel, CardTitle } from "../bootstrap/Card";
import Icon from "../icon/Icon";
import Button, { ButtonGroup } from "../bootstrap/Button";

const HeadingBuildCard = (props: any) => {
  return (
    <Card
      className="d-flex align-items-center justify-content-center"
      style={{ marginRight: "10px" }}
    >
      <div className="m-3">
        <div>
          <div style={{ display: "flex" }}>
            <Icon
              icon={props.icon}
              color="primary"
              size="lg"
              forceFamily={null}
            />
            <h5 style={{ marginLeft: "10px" }}>{props.heading}</h5>
          </div>
          <ButtonGroup size="sm">
            <Button color="primary" isOutline={true}>
              {props.firstButton}
            </Button>
            <Button color="primary" isOutline={true}>
              {props.secondButton}
            </Button>
          </ButtonGroup>
        </div>
      </div>
    </Card>
  );
};

export default HeadingBuildCard;

{
  /* <Card
        shadow="sm"
        className="mb-0"
        style={{
          minHeight: "35px",
          width: "20em",
        }}
      >
        <CardBody>
          <div style={{ display: "flex" }}>
            <Icon
              icon={props.icon}
              color="primary"
              size="lg"
              forceFamily={null}
            />
            <h5 style={{ marginLeft: "10px" }}>{props.heading}</h5>
          </div>
          <ButtonGroup size="sm">
            <Button color="primary" isOutline={true}>
              {props.firstButton}
            </Button>
            <Button color="primary" isOutline={true}>
              {props.secondButton}
            </Button>
          </ButtonGroup>
        </CardBody>
      </Card> */
}
