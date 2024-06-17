import classNames from "classnames";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import USERS from "../../../common/data/userDummyData";
import Avatar from "../../../components/Avatar";
import Alert from "../../../components/bootstrap/Alert";
import Button, { IButtonProps } from "../../../components/bootstrap/Button";
import Dropdown, {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "../../../components/bootstrap/Dropdown";
import OffCanvas, {
  OffCanvasBody,
  OffCanvasHeader,
  OffCanvasTitle,
} from "../../../components/bootstrap/OffCanvas";
import Icon from "../../../components/icon/Icon";
import { useProjectContext } from "../../../context/projectContext";
import useDarkMode from "../../../hooks/useDarkMode";
import Header, { HeaderLeft, HeaderRight } from "../../../layout/Header/Header";
import authContext from "../../../context/authContext";

const ProjectDetailHeader = () => {
  const DROPDOWN_INNER = (
    <>
      <DropdownItem>
        <div>
          <Icon icon="Assistant" /> FAQ
        </div>
      </DropdownItem>
      <DropdownItem>
        <div>
          <Icon icon="Support" /> Contact Support
        </div>
      </DropdownItem>
      <DropdownItem isDivider />

      <DropdownItem>
        <div>
          <Icon icon="VerifiedUser" /> Profile
        </div>
      </DropdownItem>
      <DropdownItem>
        <div onClick={() => signOut({ callbackUrl: "/" })}>
          <Icon icon="Login" /> Logout
        </div>
      </DropdownItem>
    </>
  );
  // @ts-ignore
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [offcanvasStatus, setOffcanvasStatus] = useState(false);
  const { darkModeStatus, setDarkModeStatus } = useDarkMode();
  const { authData } = useContext(authContext);
  const { data: userData } = authData;
  const { name } = router.query;

  const styledBtn: IButtonProps = {
    color: darkModeStatus ? "dark" : "light",
    hoverShadow: "default",
    isLight: !darkModeStatus,
    size: "lg",
  };

  return (
    <>
      <Header>
        <HeaderLeft>
          <div className="h3 fw-bold">LOGO</div>
          {/* <Icon icon="Add" size="4x" /> */}
        </HeaderLeft>

        {/* Quick Panel */}
        <div className="col-auto">
          <Dropdown>
            <DropdownToggle hasIcon={false}>
              {/* eslint-disable-next-line react/jsx-props-no-spreading */}
              <Button {...styledBtn} icon="Tune" aria-label="Quick menu" />
            </DropdownToggle>
            <DropdownMenu isAlignmentEnd size="lg" className="py-0 overflow-hidden">
              <div className="row g-0">
                <div
                  className={classNames(
                    "col-12",
                    "p-4",
                    "d-flex justify-content-center",
                    "fw-bold fs-5",
                    "text-info",
                    "border-bottom border-info",
                    {
                      "bg-l25-info": !darkModeStatus,
                      "bg-lo25-info": darkModeStatus,
                    }
                  )}
                >
                  Quick Panel
                </div>
                <div
                  className={classNames(
                    "col-6 p-4 transition-base cursor-pointer bg-light-hover",
                    "border-end border-bottom",
                    { "border-dark": darkModeStatus }
                  )}
                >
                  <div className="d-flex flex-column align-items-center justify-content-center">
                    <Icon icon="Public" size="3x" color="info" />
                    <span>Branches</span>
                  </div>
                </div>
                <div
                  className={classNames(
                    "col-6 p-4 transition-base cursor-pointer bg-light-hover",
                    "border-bottom",
                    { "border-dark": darkModeStatus }
                  )}
                  onClick={() => {
                    router.push(`/project/${name}/builds`);
                  }}
                >
                  <div className="d-flex flex-column align-items-center justify-content-center">
                    <Icon icon="BuildCircle" size="3x" color="success" />
                    <span>Builds</span>
                  </div>
                </div>
                <div
                  className={classNames(
                    "col-6 p-4 transition-base cursor-pointer bg-light-hover",
                    "border-end",
                    { "border-dark": darkModeStatus }
                  )}
                >
                  <div className="d-flex flex-column align-items-center justify-content-center">
                    <Icon icon="SignalWifiStatusbar1Bar" size="3x" color="danger" />
                    <span>Status</span>
                  </div>
                </div>
                <div
                  className={classNames(
                    "col-6 p-4 transition-base cursor-pointer bg-light-hover",
                    "border-bottom",
                    { "border-dark": darkModeStatus }
                  )}
                  onClick={() => {
                    router.push(`/project/${name}/settings`);
                  }}
                >
                  <div className="d-flex flex-column align-items-center justify-content-center">
                    <Icon icon="Public" size="3x" color="info" />
                    <span>Settings</span>
                  </div>
                </div>
                <div
                  className={classNames(
                    "col-6 p-4 transition-base cursor-pointer bg-light-hover",
                    "border-end border-top",
                    { "border-dark": darkModeStatus }
                  )}
                >
                  <div className="d-flex flex-column align-items-center justify-content-center">
                    <Icon icon="Public" size="3x" color="info" />
                    <span>Documentation</span>
                  </div>
                </div>
              </div>
            </DropdownMenu>
          </Dropdown>
        </div>

        {/*	Notifications */}
        <div className="col-auto">
          <Button
            {...styledBtn}
            icon="Notifications"
            onClick={() => setOffcanvasStatus(true)}
            aria-label="Notifications"
          />
        </div>

        <HeaderRight>
          <div
            className="col d-flex align-items-center cursor-pointer"
            role="presentation"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="me-3">
              <div className="text-end">
                {/* <div className="fw-bold fs-6 mb-0"> {userName ? `${userName}` : "User"}</div> */}
                <div className="fw-bold fs-6 mb-0">
                  {userData ? `${userData.first_name} ${userData.last_name}` : "User"}
                </div>
                <div className="text-muted"></div>
              </div>
            </div>
            <div className="position-relative">
              <Dropdown
                isOpen={dropdownOpen}
                setIsOpen={setDropdownOpen}
                className="dropdown-on-avatar"
              >
                <DropdownToggle hasIcon={false}>
                  <Button>
                    <Avatar
                      // src={userAvatar ? userAvatar : USERS.CHLOE.src}
                      src={userData ? userData.avatar_url : USERS.CHLOE.src}
                      size={48}
                      color={USERS.CHLOE.color}
                    />
                  </Button>
                </DropdownToggle>
                <DropdownMenu isAlignmentEnd={true}>{DROPDOWN_INNER}</DropdownMenu>
              </Dropdown>
            </div>
          </div>
        </HeaderRight>
      </Header>

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

export default ProjectDetailHeader;
