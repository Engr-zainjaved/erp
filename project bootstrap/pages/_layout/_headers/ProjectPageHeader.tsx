"use client";

import { signOut } from "next-auth/react";
import { useContext, useState } from "react";
import USERS from "../../../common/data/userDummyData";
import Avatar from "../../../components/Avatar";
import Button, { IButtonProps } from "../../../components/bootstrap/Button";
import Dropdown, {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "../../../components/bootstrap/Dropdown";
import Icon from "../../../components/icon/Icon";
import useDarkMode from "../../../hooks/useDarkMode";
import useDeviceScreen from "../../../hooks/useDeviceScreen";
import Header, { HeaderLeft, HeaderRight } from "../../../layout/Header/Header";
import Navigation from "../../../layout/Navigation/Navigation";
import { projectPagesMenu } from "../../../menu";
import authContext from "../../../context/authContext";

const ProjectPageHeader = () => {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
    localStorage.clear();
  };

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
        <div
          // onClick={() => signOut({ callbackUrl: "/" })}
          onClick={handleLogout}
        >
          <Icon icon="Login" /> Logout
        </div>
      </DropdownItem>
    </>
  );
  // @ts-ignore
  const deviceScreen = useDeviceScreen();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { darkModeStatus, setDarkModeStatus } = useDarkMode();
  const { authData } = useContext(authContext);
  const { data: userData } = authData;

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
          {/* <div className="d-flex align-items-center ">
            <div className="h3 fw-bold mr-3">LOGO</div> */}

          <Navigation
            menu={projectPagesMenu.components.subMenu}
            id={`${projectPagesMenu.components.id}top-menu`}
            horizontal={
              !!deviceScreen?.width &&
              deviceScreen.width >= Number(process.env.NEXT_PUBLIC_MOBILE_BREAKPOINT_SIZE)
            }
          />
          {/* </div> */}
        </HeaderLeft>

        <HeaderRight>
          <div
            className="col d-flex align-items-center cursor-pointer"
            role="presentation"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="me-3">
              <div className="text-end">
                {/* <div className="fw-bold fs-6 mb-0">{userName ? `${userName}` : "User"}</div> */}
                <div className="fw-bold fs-6 mb-0">
                  {userData ? `${userData?.first_name} ${userData?.last_name}` : "User"}
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
                    {/* <Avatar src={USERS.CHLOE.src} size={48} color={USERS.CHLOE.color} /> */}
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
    </>
  );
};

export default ProjectPageHeader;
