"use client";

import { AnyCnameRecord } from "dns";
import Card, {
  CardActions,
  CardBody,
  CardFooter,
  CardFooterLeft,
  CardFooterRight,
  CardHeader,
  CardLabel,
  CardSubTitle,
  CardTitle,
} from "../bootstrap/Card";
import Icon from "../icon/Icon";
import Button, { ButtonGroup } from "../bootstrap/Button";
import Dropdown, {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "../bootstrap/Dropdown";
import Link from "next/link";
import Badge from "../bootstrap/Badge";
import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "../bootstrap/Modal";
import { useState } from "react";
import Input from "../bootstrap/forms/Input";
import { useFormik } from "formik";
import SubHeader, { SubHeaderLeft } from "../../layout/SubHeader/SubHeader";
import FormGroup from "../bootstrap/forms/FormGroup";
import useSortableData from "../../hooks/useSortableData";
import PaginationButtons, { dataPagination } from "../PaginationButtons";
import useSelectTable from "../../hooks/useSelectTable";

export const DROPDOWN_MENU = (
  <>
    <DropdownItem>
      <Link href="#">Logs</Link>
    </DropdownItem>
    <DropdownItem>
      <Link href="#">Web Shells</Link>
    </DropdownItem>
    <DropdownItem>
      <Link href="#">Editor</Link>
    </DropdownItem>
    <DropdownItem>
      <Link href="#">Monitoring</Link>
    </DropdownItem>
    <DropdownItem>
      <Link href="#">Download DB dump</Link>
    </DropdownItem>
  </>
);

const DetailBuildCard = (props: any) => {
  const [connectAsModal, setConnectAsModal] = useState(false);

  const formik = useFormik({
    initialValues: {
      searchInput: "",
      connectSpecificLogin: "",
    },
    onSubmit: () => {},
  });

  const DROPDOWN_INNER = (
    <DropdownItem>
      <div className="col text-nowrap overflow-hidden text-overflow-ellipsis">
        <Icon icon="Send" />{" "}
        <span onClick={() => setConnectAsModal(true)}> Connect as </span>
      </div>
    </DropdownItem>
  );

  const data = [{ id: 1, Name: "John", Login: "Doe" }];

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(3);

  const { items, requestSort, getClassNamesFor } = useSortableData(data);
  const onCurrentPageData = dataPagination(items, currentPage, perPage);
  const { selectTable, SelectAllCheck } = useSelectTable(onCurrentPageData);

  return (
    <>
      <Card
        tag={props.tag}
        shadow="md"
        borderSize={2}
        borderColor={props.color}
        stretch={false}
        style={{ width: "29em" }}
      >
        <CardHeader size="sm">
          <CardLabel>
            <CardTitle>pushing odoo code</CardTitle>
          </CardLabel>
          <CardActions>
            <Dropdown>
              <DropdownToggle hasIcon={false}>
                <Button hoverShadow="default" icon="MoreVert" />
              </DropdownToggle>
              <DropdownMenu>{DROPDOWN_MENU}</DropdownMenu>
            </Dropdown>
          </CardActions>
        </CardHeader>

        <CardBody>
          <div className="d-flex justify-content-between">
            <div style={{ display: "flex" }}>
              <Icon
                icon={"PersonAdd"}
                color="primary"
                size="lg"
                forceFamily={null}
              />
              <h5 style={{ marginLeft: "10px" }}>{"Noman Jallal"}</h5>
            </div>
            <div>
              <div className="d-flex align-items-center">
                <p style={{ marginRight: "5px" }}>Age:</p>
                <small>
                  <p>{"8 days ago"}</p>
                </small>
              </div>
              <div className="d-flex align-items-center">
                <p style={{ marginRight: "5px" }}>Duration:</p>
                <small>
                  <p>{"0:00:50"}</p>
                </small>
              </div>
            </div>
          </div>
          <Card borderSize={1}>
            <span style={{ marginLeft: "5px" }}>{props.message} </span>
          </Card>
        </CardBody>

        <CardFooter size="lg" borderSize={null} borderColor={null}>
          <CardFooterLeft>
            <div className="d-flex">
              <div
                className="bg-dark shadow-none rounded-start rounded-0 d-flex align-items-center justify-content-cneter"
                style={{ color: "white" }}
              >
                <span style={{ margin: "5px" }}>build</span>
              </div>
              <div
                className="bg-info shadow-none rounded-0 d-flex align-items-center justify-content-cneter"
                style={{ color: "white" }}
              >
                <span style={{ margin: "5px" }}>build</span>
              </div>
              <div
                className="bg-success shadow-none rounded-end rounded-0 d-flex align-items-center justify-content-cneter"
                style={{ color: "white" }}
              >
                <span style={{ margin: "5px" }}>build</span>
              </div>
            </div>
          </CardFooterLeft>
          <CardFooterRight>
            <Button color="dark" size="lg" icon="CustomGithub" isLight />
            <ButtonGroup size="sm">
              <div className="row g-4">
                <div className="col-auto">
                  <Dropdown isButtonGroup>
                    <Button color="success">Connect</Button>
                    <DropdownToggle>
                      <Button color="success" />
                    </DropdownToggle>
                    <DropdownMenu>{DROPDOWN_INNER}</DropdownMenu>
                  </Dropdown>
                </div>
              </div>
            </ButtonGroup>
          </CardFooterRight>
        </CardFooter>
      </Card>

      {/* Connect as Modal */}

      <Modal
        isOpen={connectAsModal}
        setIsOpen={setConnectAsModal}
        titleId="createBackup"
        isStaticBackdrop={true}
        isScrollable={false}
        isCentered={false}
        size="lg"
        fullScreen={false}
        isAnimation={false}
      >
        <ModalHeader
          setIsOpen={setConnectAsModal} // Example: setState
        >
          <ModalTitle id="MODAL">Internal Users (1)</ModalTitle>
        </ModalHeader>
        <ModalBody {...props}>
          <div className="container">
            <div className="row">
              <div className="col-6">
                {" "}
                <Input
                  id="searchInput"
                  type="search"
                  placeholder="Search Internal Users list"
                  onChange={formik.handleChange}
                  value={formik.values.searchInput}
                />
              </div>

              <div className="col-6">
                <FormGroup>
                  <div className="d-flex mb-3">
                    <div style={{ width: "100%" }}>
                      <Input
                        id="connectSpecificLogin"
                        placeholder="connect with a specific login"
                        aria-label="connectSpecificLogin"
                        autoComplete="connectSpecificLogin"
                        ariaDescribedby="addon1"
                        onChange={formik.handleChange}
                        value={formik.values.connectSpecificLogin}
                      />
                    </div>
                    <Button color="success">Connect</Button>
                  </div>
                </FormGroup>
              </div>
            </div>
          </div>
          <hr className="my-3" />
          <div className="col-12">
            <Card>
              <CardBody>
                <table className="table table-modern">
                  <thead>
                    <tr>
                      <th className="cursor-pointer text-decoration-underline">
                        Name
                        <Icon size="lg" icon="FilterList" />
                      </th>
                      <th className="cursor-pointer text-decoration-underline">
                        Login <Icon size="lg" icon="FilterList" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {onCurrentPageData.map((item) => (
                      <tr key={item.id}>
                        <td>{item.Name}</td>
                        <td>{item.Login}</td>
                        <td>
                          <Button>
                            <Icon icon="ArrowForwardIos" />
                            Connect
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardBody>
              <PaginationButtons
                data={items}
                label="items"
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                perPage={perPage}
                setPerPage={setPerPage}
              />
            </Card>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="success">OK</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default DetailBuildCard;
