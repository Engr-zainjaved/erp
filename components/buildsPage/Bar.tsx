import Link from "next/link";
import Card, { CardLabel, CardTitle } from "../bootstrap/Card";
import Icon from "../icon/Icon";

const Bar = (props: any) => {
  return (
    <Card
      shadow="sm"
      className="mb-0"
      style={{
        minHeight: "35px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <CardLabel>
        <div className="d-flex align-items-center">
          <CardTitle style={{ marginLeft: "10px", marginRight: "10px" }}>
            {props.heading}
          </CardTitle>
          <Icon
            icon={props.icon}
            color="primary"
            size="lg"
            forceFamily={null}
          />
        </div>
      </CardLabel>
    </Card>
  );
};

export default Bar;

{
  /* <Icon
icon="Save"
color="primary" // null || 'primary' || 'secondary' || 'success' || 'info' || 'warning' || 'danger' || 'light' || 'dark'
size="lg" // null || 'sm' || 'md' || 'lg' || '2x' || '3x' || '4x' || '5x' || '6x' || '7x' || '8x' || '9x' || '10x'
forceFamily={null} // null || 'custom' || 'material'
/> */
}
