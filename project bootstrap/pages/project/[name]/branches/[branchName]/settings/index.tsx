"client";

import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Alert from "../../../../../../components/bootstrap/Alert";
import Button from "../../../../../../components/bootstrap/Button";
import ListGroup, { ListGroupItem } from "../../../../../../components/bootstrap/ListGroup";
import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "../../../../../../components/bootstrap/Modal";
import Option from "../../../../../../components/bootstrap/Option";
import Spinner from "../../../../../../components/bootstrap/Spinner";
import Checks from "../../../../../../components/bootstrap/forms/Checks";
import FormGroup from "../../../../../../components/bootstrap/forms/FormGroup";
import Input from "../../../../../../components/bootstrap/forms/Input";
import InputGroup from "../../../../../../components/bootstrap/forms/InputGroup";
import Select from "../../../../../../components/bootstrap/forms/Select";
import Icon from "../../../../../../components/icon/Icon";
import { useProjectContext } from "../../../../../../context/projectContext";
import { isProductionBranch } from "../../../../../../helpers/helpers";
import useDeleteProjectBranch from "../../../../../../hooks/useDeleteProjectBranch";
import Page from "../../../../../../layout/Page/Page";

const ProjectBranchSettings = () => {
  const router = useRouter();
  const { name, branchName } = router.query;
  const [showAlert, setShowAlert] = useState(false);
  const { branchData } = useProjectContext();
  const [showDomainModal, setShowDomainModal] = useState(false);
  const [isDeleteButtonEnabled, setIsDeleteButtonEnabled] = useState(false);
  const [isProductionBranchId, setIsProductionBranchId] = useState(false);
  const { deleteProjectBranch, isLoadingDeleteProjectBranch } = useDeleteProjectBranch();

  let selectedProjectId: any;
  let selectedBranchId: any;
  try {
    selectedProjectId = localStorage.getItem("projectId");
    selectedBranchId = localStorage.getItem("branchId");
  } catch (error) {
    console.error("error in localStorage", error);
  }

  useEffect(() => {
    setIsProductionBranchId(isProductionBranch(branchData, selectedBranchId));
  }, [branchData]);

  const toggleAlert = () => {
    setTimeout(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    setShowAlert(!showAlert);
  };

  const handleDeleteProjectBranch = (
    projectId: number,
    selectedBranchId: number,
    projectName: any
  ) => {
    deleteProjectBranch(projectId, selectedBranchId, projectName);
  };

  const formik = useFormik({
    initialValues: {
      githubUsername: "",
      exampleMailAddress: "",
      exampleUrl: "",
      examplePrice: "",
      exampleCompanyEmail: "",
      exampleCompanyServer: "",
      exampleDescription: "",
      allowPublicAccess: false,
      githubSubModule: "",
      stagingBranches: 0,
      confirmationName: "",
      flexRadioDefault: "",
      moduleInstallation: "",
      testSuits: "",
    },
    onSubmit: (values) => {},
  });

  return (
    <Page>
      <br style={{ marginTop: "5rem" }} />

      {/* Behavior upon new commits */}

      <div className="row">
        <div className="col-md-6">
          <div className="d-flex align-items-center">
            <Icon icon="Public" className="" color="dark" size="2x" forceFamily={null} />

            <h2 style={{ marginLeft: "10px" }}>Behavior upon new commits</h2>
          </div>
          <div style={{ width: "50%" }}>
            <small>
              New commits will either do nothing, create new builds or update the previous one if it
              is still running.
            </small>
          </div>
        </div>
        <div className="col-md-6">
          <Select
            id="defaultSelect"
            ariaLabel="Default select example"
            onChange={formik.handleChange}
          >
            <Option value="1">Do nothing</Option>
            <Option value="2">New build</Option>
            <Option value="3">Update previous build</Option>
          </Select>
        </div>
      </div>
      <hr style={{ margin: "5rem 0" }} />

      {/*Development build behavior*/}

      <div className="row">
        <div className="col-md-6">
          <div className="d-flex align-items-center">
            <Icon icon="Public" className="" color="dark" size="2x" forceFamily={null} />

            <h2 style={{ marginLeft: "10px" }}>Development build behavior</h2>
          </div>
        </div>
        <div className="col-md-6">
          <div className="d-flex align-items-center">
            <Checks
              id="flexCheckDefault"
              label="Use default"
              name="allowPublicAccess"
              onChange={formik.handleChange}
              checked={formik.values.allowPublicAccess}
            />
            <Button icon="edit" style={{ marginLeft: "5px" }}>
              Modify default
            </Button>
          </div>
        </div>
      </div>
      <hr style={{ margin: "5rem 0" }} />

      {/*Module installation */}

      <div className="row">
        <div className="col-md-6">
          <div className="d-flex align-items-center">
            <Icon icon="Public" className="" color="dark" size="2x" forceFamily={null} />

            <h2 style={{ marginLeft: "10px" }}>Module installation</h2>
          </div>
          <div style={{ width: "50%" }}>
            <small>
              All installed modules will be tested except if you select Full installation. This
              setting applies only to this development branch.
            </small>
          </div>
        </div>
        <div className="col-md-6">
          <Checks
            type="radio"
            name="flexRadioDefault"
            id="flexRadioDefault1"
            label="Install only my modules (does not include submodules)"
            value="first"
            onChange={formik.handleChange}
            checked={formik.values.flexRadioDefault}
          />
          <Checks
            type="radio"
            name="flexRadioDefault"
            id="flexRadioDefault2"
            label="Full installation (no test suite)"
            value="second"
            onChange={formik.handleChange}
            checked={formik.values.flexRadioDefault}
          />
          <Checks
            type="radio"
            name="flexRadioDefault"
            id="flexRadioDefault2"
            label="Install a list of modules"
            value="second"
            onChange={formik.handleChange}
            checked={formik.values.flexRadioDefault}
          />
        </div>
      </div>
      <hr style={{ margin: "5rem 0" }} />

      {/*Test suite */}

      <div className="row">
        <div className="col-md-6">
          <div className="d-flex align-items-center">
            <Icon icon="Public" className="" color="dark" size="2x" forceFamily={null} />

            <h2 style={{ marginLeft: "10px" }}>Test suite</h2>
          </div>
          <div style={{ width: "50%" }}>
            <small>
              Odoo has a test suite that can help validate your customizations. You can choose to
              disable it if you wish to reduce the build's creation time, but be aware this goes
              against best practices.
            </small>
          </div>
        </div>
        <div className="col-md-6">
          <Checks
            id="flexCheckDefault"
            label="Validate the test suite on new builds."
            name="moduleInstallation"
            onChange={formik.handleChange}
            checked={formik.values.moduleInstallation}
          />

          <FormGroup
            className="mb-3 mt-3"
            id="exampleLabel"
            label="Test tags can be added to limit the tests to be run on new builds (comma-separated tags)"
          >
            <Input placeholder="For example: custom_tags,at_install,post_install" />
          </FormGroup>
        </div>
      </div>
      <hr style={{ margin: "5rem 0" }} />

      {/*Odoo Version */}

      <div className="row">
        <div className="col-md-6">
          <div className="d-flex align-items-center">
            <Icon icon="Public" className="" color="dark" size="2x" forceFamily={null} />

            <h2 style={{ marginLeft: "10px" }}>Odoo Version</h2>
          </div>
          <div style={{ width: "50%" }}>
            <small>
              Stick the Odoo codebase to a specific revision, or get the weekly updates to benefit
              of the latest security, bug and performance fixes.
            </small>
          </div>
        </div>
        <div className="col-md-6">
          <div className="row">
            <div className="col-md-6">
              <FormGroup className="mb-3 mt-3" id="exampleLabel" label="Version">
                <Select
                  id="defaultSelect"
                  ariaLabel="Default select example"
                  onChange={formik.handleChange}
                >
                  <Option value="1">15.0</Option>
                  <Option value="2">16.0</Option>
                  <Option value="3">17.0</Option>
                </Select>
              </FormGroup>
            </div>
            <div className="col-md-6">
              <FormGroup className="mb-3 mt-3" id="exampleLabel" label="Revision">
                <Select
                  id="defaultSelect"
                  ariaLabel="Default select example"
                  onChange={formik.handleChange}
                >
                  <Option value="1">Latest</Option>
                  <Option value="2">16.000256</Option>
                  <Option value="3">16.000214</Option>
                </Select>
              </FormGroup>
            </div>

            <span>
              <strong>
                Information <br />
              </strong>
              The sources of your Odoo server will be updated weekly. <br />
              You will benefit from the latest bug, security and performance fixes automatically.
            </span>
            <span className="mt-3 mb-3">
              <strong>
                Repository revisions <br />
              </strong>
            </span>

            <ListGroup>
              <ListGroupItem>
                <Link href="#" style={{ textDecoration: "none" }}>
                  <div className="d-flex justify-content-between">
                    <div>odoo</div>
                    <div>
                      <span style={{ marginRight: "10px" }}>
                        557a1a73fe3c7539da1c27ee5abc1e701a2fca43
                      </span>
                      <Icon
                        icon="customGithub"
                        className=""
                        color="dark"
                        size="sm"
                        forceFamily={null}
                      />
                    </div>
                  </div>
                </Link>
              </ListGroupItem>
              <ListGroupItem>
                <Link href="#" style={{ textDecoration: "none" }}>
                  <div className="d-flex justify-content-between">
                    <div>enterprise</div>
                    <div>
                      <span style={{ marginRight: "10px" }}>
                        557a1a73fe3c7539da1c27ee5abc1e701a2fca43
                      </span>
                      <Icon
                        icon="customGithub"
                        className=""
                        color="dark"
                        size="sm"
                        forceFamily={null}
                      />
                    </div>
                  </div>
                </Link>
              </ListGroupItem>
              <ListGroupItem>
                <Link href="#" style={{ textDecoration: "none" }}>
                  <div className="d-flex justify-content-between">
                    <div>themes</div>
                    <div>
                      <span style={{ marginRight: "10px" }}>
                        557a1a73fe3c7539da1c27ee5abc1e701a2fca43
                      </span>
                      <Icon
                        icon="customGithub"
                        className=""
                        color="dark"
                        size="sm"
                        forceFamily={null}
                      />
                    </div>
                  </div>
                </Link>
              </ListGroupItem>
            </ListGroup>
            <span>
              <small>
                Change the Odoo version for this branch only. This setting applies to future builds.
              </small>
            </span>
          </div>
        </div>
      </div>
      <hr style={{ margin: "5rem 0" }} />

      {/* Custom domains */}

      <div className="row">
        <div className="col-md-6">
          <div className="d-flex align-items-center">
            <Icon icon="Public" className="" color="dark" size="2x" forceFamily={null} />

            <h2 style={{ marginLeft: "10px" }}>Custom domains</h2>
          </div>
          <div style={{ width: "50%" }}>
            <small>Associate a domain to the last build of the branch.</small>
          </div>
        </div>
        <div className="col-md-6">
          <InputGroup>
            <Input
              placeholder="www.your-domain.com"
              ariaLabel="Recipient's username with two button addons"
            />
            <Button color="success">Add domain</Button>
          </InputGroup>
          <div className="mt-3">
            <span>
              You can use <em>*.odoo.com </em> or your own domain.
              <br />
              Note that with your own domain, you have to configure the DNS entries accordingly.
            </span>
          </div>
          <Button
            className="mt-3"
            icon="ArrowForwardIos"
            isOutline
            color="dark"
            style={{ textDecoration: "underline" }}
            onClick={() => {
              setShowDomainModal(true);
            }}
          >
            How to set up my domain
          </Button>
        </div>
      </div>
      <hr style={{ margin: "5rem 0" }} />

      {/* Custom Domain Modal */}

      <Modal
        isOpen={showDomainModal}
        setIsOpen={setShowDomainModal}
        titleId="exampleModalLabel"
        isStaticBackdrop={false}
        isScrollable={false}
        isCentered={false}
        size="lg"
        fullScreen={false}
        isAnimation={false}
      >
        <ModalHeader setIsOpen={showDomainModal ? setShowDomainModal : undefined}>
          <ModalTitle id="exampleModalLabel">Domain Configuration</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <span>Perform the following operations in your domain manager:</span>
          <ul>
            <li>
              Create a CNAME record www.yourdomain.com pointing to
              nomanjallal-d-poc-we22-11312229.dev.odoo.com.
            </li>
            <li>
              If you want to use the naked domain (e.g. yourdomain.com), you need to redirect
              yourdomain.com to www.yourdomain.com.
            </li>
          </ul>
          <h2>SSL/HTTPS</h2>
          <p>
            If the redirection is correctly set up, the platform will automatically generate an SSL
            certificate with <br />
            Let's Encrypt within the hour and your domain will be accessible through HTTPS. <br />
            It is currently not possible to configure your own SSL certificates on the Odoo.sh
            platform.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button
            color="info"
            isOutline
            className="border-0"
            onClick={() => setShowDomainModal(false)}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>

      {/*Delete Project Branch*/}

      {isProductionBranchId && (
        <Alert color="danger" isLight className="d-block p-3">
          <span>
            You cannot delete the <strong>Production Branch </strong>. <br />
            The only way to delete a production branch is to delete the entire project
          </span>
        </Alert>
      )}

      {!isProductionBranchId && (
        <div className="row">
          <div className="col-md-6"></div>
          <div className="col-md-6 d-flex justify-content-end">
            <div>
              <Button
                color="danger"
                isDisable={isLoadingDeleteProjectBranch}
                onClick={() => toggleAlert()}
              >
                Delete branch
              </Button>
            </div>
          </div>
        </div>
      )}
      <br />
      {showAlert && (
        <Alert color="danger" isLight className="d-block p-3">
          <div className="row">
            <div className="col-md-8">
              <span>
                This action will permanently delete the branch <strong>{branchName} </strong> and
                its builds. <br />
                This action <strong>CANNOT</strong> be undone .
              </span>
              <Input
                placeholder={`type the name "${branchName}" to confirm`}
                onChange={(e: any) => {
                  formik.handleChange(e);
                  const confirmationName = e.target.value;
                  setIsDeleteButtonEnabled(confirmationName === branchName);
                }}
                value={formik.values.confirmationName}
                name="confirmationName"
              />
            </div>
            <div className="col-md-4 d-flex align-items-center justify-content-end">
              <div>
                <Button
                  color="success"
                  style={{ marginRight: "10px" }}
                  isDisable={isLoadingDeleteProjectBranch}
                  onClick={() => toggleAlert()}
                >
                  Abort deleting
                </Button>

                <Button
                  color="danger"
                  isOutline
                  icon="warning"
                  isDisable={!isDeleteButtonEnabled || isLoadingDeleteProjectBranch}
                  onClick={() =>
                    handleDeleteProjectBranch(selectedProjectId, selectedBranchId, name)
                  }
                >
                  <span style={{ marginRight: "0.5rem" }}>Delete branch</span>
                  {isLoadingDeleteProjectBranch && <Spinner color="danger" isSmall />}
                </Button>
              </div>
            </div>
          </div>
        </Alert>
      )}
    </Page>
  );
};

export default ProjectBranchSettings;
