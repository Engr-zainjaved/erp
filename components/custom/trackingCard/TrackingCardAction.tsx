import { useEffect } from "react";
import Link from "next/link";
import Dropdown, { DropdownItem, DropdownMenu, DropdownToggle } from "../../bootstrap/Dropdown";
import Popovers from "../../bootstrap/Popovers";
import Icon from "../../icon/Icon";
import Spinner from "../../bootstrap/Spinner";
import Button from "../../bootstrap/Button";
import { CardActions } from "../../bootstrap/Card";

interface TrackingCardActionProps {
  status: string;
  buildId?: string;
  errorMessage?: string;
  buildUrl?: string;
}

const DROPDOWN_INNER = (
  <>
    <DropdownItem>
      <Link href="#">Connect as</Link>
    </DropdownItem>
  </>
);

const TrackingCardAction = ({
  status,
  buildId,
  errorMessage,
  buildUrl,
}: TrackingCardActionProps) => {
  useEffect(() => {
    if (status === "success" && buildId) {
      localStorage.setItem("buildId", buildId);
    }
  }, [status, buildId]);

  return (
    <CardActions>
      <span style={{ display: "flex", alignItems: "center" }}>
        {status && <strong>Test: </strong>}
        {status === "in_progress" ? (
          <span className="m-2"> In Progress</span>
        ) : status === "error" ? (
          <span className="m-2"> Error</span>
        ) : status === "expired" ? (
          <span className="m-2"> Expired</span>
        ) : status === "success" ? (
          <span className="m-2"> Success</span>
        ) : status === "dropped" ? (
          <span className="m-2"> Dropped</span>
        ) : status === "restore_succeed" ? (
          <span className="m-2"> Restore Succeed</span>
        ) : status === "restore_failed" ? (
          <span className="m-2"> Restore Failed</span>
        ) : status === "import_succeed" ? (
          <span className="m-2"> Import Succeed</span>
        ) : status === "import_failed" ? (
          <span className="m-2"> Import Failed</span>
        ) : (
          status
        )}

        {status === "in_progress" && (
          <span style={{ marginLeft: "10px" }}>
            <Spinner tag="span" color="dark" />
          </span>
        )}

        {errorMessage && errorMessage !== "" && (
          <Popovers desc={errorMessage} trigger="hover">
            <Icon icon="Assistant" className="h5 m-2 text-danger" />
          </Popovers>
        )}

        {status === "success" && buildUrl ? (
          <Dropdown isButtonGroup>
            <Button
              color="success"
              onClick={() => window.open(buildUrl, "_blank")}
              style={{ marginLeft: "10px" }}
            >
              Connect
            </Button>
            <DropdownToggle>
              <Button color="success" />
            </DropdownToggle>
            <DropdownMenu>{DROPDOWN_INNER}</DropdownMenu>
          </Dropdown>
        ) : status === "dropped" ? (
          <Button color="dark" isLight isDisable={true} style={{ marginLeft: "10px" }}>
            Dropped
          </Button>
        ) : status === "error" ? (
          <Button color="warning" isLight style={{ marginLeft: "10px" }}>
            Rebuild
          </Button>
        ) : null}
      </span>
    </CardActions>
  );
};

export default TrackingCardAction;
