import { useFormik } from "formik";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Accordion, { AccordionItem } from "../../../../components/bootstrap/Accordion";
import Alert from "../../../../components/bootstrap/Alert";
import Button from "../../../../components/bootstrap/Button";
import Card, { CardBody } from "../../../../components/bootstrap/Card";
import ListGroup, { ListGroupItem } from "../../../../components/bootstrap/ListGroup";
import Option from "../../../../components/bootstrap/Option";
import Tooltips from "../../../../components/bootstrap/Tooltips";
import Checks from "../../../../components/bootstrap/forms/Checks";
import FormGroup from "../../../../components/bootstrap/forms/FormGroup";
import Input from "../../../../components/bootstrap/forms/Input";
import InputGroup, { InputGroupText } from "../../../../components/bootstrap/forms/InputGroup";
import Select from "../../../../components/bootstrap/forms/Select";
import Icon from "../../../../components/icon/Icon";
import Page from "../../../../layout/Page/Page";
import useDeleteProject from "../../../../hooks/useDeleteProject";
import { ToastContainer } from "react-toastify";
import Spinner from "../../../../components/bootstrap/Spinner";
import Dropdown, {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "../../../../components/bootstrap/Dropdown";
import axios from "axios";
import request from "../../../../common/lib/axios";
import { handleApiSuccess } from "../../../../common/function/apiHelper/apiSuccess";
import { PAT } from "../../../../common/data/personalAccessToken";

interface GitHubUser {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  score: number;
  email: string;
}

interface Collaborator {
  id: number;
  username: string;
  is_admin: boolean;
  avatar_url: string;
  github_url: string;
}

const ProjectSettings = () => {
  const router = useRouter();
  const { name } = router.query;
  const [showAlert, setShowAlert] = useState(false);
  const [isDeleteButtonEnabled, setIsDeleteButtonEnabled] = useState(false);
  const { deleteProject, isLoadingDeleteProject } = useDeleteProject();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [users, setUsers] = useState<GitHubUser[]>([]);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);

  let selectedProjectId: any;
  try {
    selectedProjectId = localStorage.getItem("projectId");
  } catch (error) {
    console.error("error in localStorage", error);
  }

  const handleDeleteProject = () => {
    if (selectedProjectId) {
      deleteProject(selectedProjectId);
    }
  };

  const toggleAlert = () => {
    setTimeout(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    setShowAlert(!showAlert);
  };

  const formik = useFormik({
    initialValues: {
      githubUsername: "",
      githubUserEmail: "",
      githubAvatarUrl: "",
      githubHtmlUrl: "",
      githubReposUrl: "",
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
    },
    onSubmit: (values, { resetForm }) => {
      addCollaborator(
        values.githubUsername,
        values.githubUserEmail,
        values.githubAvatarUrl,
        values.githubHtmlUrl,
        values.githubReposUrl,
        resetForm
      );
    },
  });

  const addCollaborator = async (
    gitHubUserName: string,
    gitHubUserEmail: string,
    githubAvatarUrl: string,
    githubHtmlUrl: string,
    githubReposUrl: string,
    resetForm: () => void,
    isAdmin: boolean = false
  ) => {
    try {
      const response = await request.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/user/project/${selectedProjectId}/collaborators/`,
        {
          github_login: gitHubUserName,
          is_admin: isAdmin,
          github_meta: {
            name: gitHubUserName,
            email: gitHubUserEmail,
            avatar_url: githubAvatarUrl,
            html_url: githubHtmlUrl,
            repos_url: githubReposUrl,
          },
        }
      );
      handleApiSuccess(response);
      resetForm();
      fetchCollaborators();
    } catch (error) {
      console.error(error);
      resetForm();
    }
  };

  const fetchCollaborators = async () => {
    try {
      const response = await request.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/user/project/${selectedProjectId}/collaborators/`
      );
      const collaboratorsArray = response.data.data.users;
      setCollaborators(collaboratorsArray);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchCollaborators();
  }, [selectedProjectId]);

  const handleRoleChange = async (collaborator: Collaborator, newRole: string) => {
    try {
      const isAdmin = newRole === "1";

      const response = await request.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/user/project/${selectedProjectId}/collaborators/${collaborator.id}/`,
        {
          is_admin: isAdmin,
        }
      );

      setCollaborators((prevCollaborators) =>
        prevCollaborators.map((c) => (c.id === collaborator.id ? { ...c, is_admin: isAdmin } : c))
      );

      handleApiSuccess(response);
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const handleDeleteCollaborator = async (collaborator: Collaborator) => {
    try {
      await request.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/user/project/${selectedProjectId}/collaborators/${collaborator.id}/`
      );

      setCollaborators((prevCollaborators) =>
        prevCollaborators.filter((c) => c.id !== collaborator.id)
      );
    } catch (error) {
      console.error("Error deleting collaborator:", error);
    }
  };

  // const fetchGitHubUsers = async (e: any) => {
  //   formik.handleChange(e);
  //   const query = e.target.value;
  //   const limit = 3;
  //   const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN || PAT;

  //   const url = `https://api.github.com/search/users?q=${query}&per_page=${limit}`;

  //   if (query.length > 0) {
  //     try {
  //       const response = await axios.get(url, {
  //         headers: {
  //           Authorization: `token ${token}`,
  //           Accept: "application/vnd.github.v3+json",
  //         },
  //       });

  //       // Assuming response.data.items contains an array of users
  //       const users = response.data.items;

  //       // Now, for each user, fetch more details including email
  //       const usersWithEmail = await Promise.all(
  //         users.map(async (user: any) => {
  //           const userDetailsUrl = `https://api.github.com/users/${user.login}`;
  //           const userDetailsResponse = await axios.get(userDetailsUrl, {
  //             headers: {
  //               Authorization: `token ${token}`,
  //               Accept: "application/vnd.github.v3+json",
  //             },
  //           });
  //           console.log("userDetailsResponse.data", userDetailsResponse.data);
  //           return userDetailsResponse.data;
  //         })
  //       );

  //       // usersWithEmail should now contain user details including email
  //       setUsers(usersWithEmail);

  //       if (!dropdownOpen) {
  //         setDropdownOpen(true);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching GitHub users:", error);
  //     }
  //   } else {
  //     setUsers([]);
  //     if (dropdownOpen) {
  //       setDropdownOpen(false);
  //     }
  //   }
  // };

  const fetchGitHubUsers = async (e: any) => {
    formik.handleChange(e);
    const query = e.target.value;
    const limit = 3;
    const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN || PAT;

    const url = `https://api.github.com/search/users?q=${query}&per_page=${limit}`;

    if (query.length > 0) {
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `token ${token}`,
            Accept: "application/vnd.github.v3+json",
          },
        });
        setUsers(response.data.items);
        if (!dropdownOpen) {
          setDropdownOpen(true);
        }
      } catch (error) {
        console.error("Error fetching GitHub users:", error);
      }
    } else {
      setUsers([]);
      if (dropdownOpen) {
        setDropdownOpen(false);
      }
    }
  };

  return (
    <Page>
      <ToastContainer />
      <br style={{ marginTop: "5rem" }} />

      {/* PROJECT NAME */}

      <div className="row">
        <div className="col-md-6">
          <div className="d-flex align-items-center">
            <Icon icon="Public" className="" color="dark" size="2x" forceFamily={null} />

            <h2 style={{ marginLeft: "10px" }}>Project Name</h2>
          </div>
        </div>
        <div className="col-md-6">
          <InputGroup>
            <InputGroupText id="addon3">https://</InputGroupText>
            <Input
              id="exampleUrl"
              ariaDescribedby="addon3"
              onChange={formik.handleChange}
              value={formik.values.exampleUrl}
              name="exampleUrl"
            />
            <InputGroupText>.odoo.com</InputGroupText>
          </InputGroup>
          <small>
            <em>This will change URLs for all future builds and for the production build.</em>
          </small>
          <div>
            <Button
              color="success"
              size="sm"
              rounded="default"
              shadow="default"
              hoverShadow="default"
              tag="button"
              type="submit"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
      <hr style={{ margin: "5rem 0" }} />

      {/*Collaborators */}

      <div className="row">
        <div className="col-md-6">
          <div className="d-flex align-items-center">
            <Icon icon="Public" className="" color="dark" size="2x" forceFamily={null} />

            <h2 style={{ marginLeft: "10px" }}>Collaborators</h2>
          </div>
          <div style={{ width: "50%" }}>
            <small>
              Grant other Github users access to this project. User rights disable access to
              production data and the settings. Push privileges on the repository are handled on
              Github.
            </small>
          </div>
        </div>
        <div className="col-md-6">
          <Dropdown isOpen={dropdownOpen} setIsOpen={setDropdownOpen} className="col-md-12">
            <DropdownToggle hasIcon={false}>
              <InputGroup>
                <Input
                  placeholder="Github username"
                  ariaLabel="Github username"
                  ariaDescribedby="button-addon2"
                  onChange={fetchGitHubUsers}
                  value={formik.values.githubUsername}
                  name="githubUsername"
                />
                <Button color="success" id="githubUsername" onClick={formik.handleSubmit}>
                  Add
                </Button>
              </InputGroup>
            </DropdownToggle>

            <DropdownMenu className="col-md-10">
              {users.length > 0 &&
                users.map((user) => (
                  <DropdownItem
                    key={user.id}
                    onClick={() => {
                      formik.setFieldValue("githubUsername", user.login);
                      formik.setFieldValue("githubAvatarUrl", user.avatar_url);
                      formik.setFieldValue("githubHtmlUrl", user.html_url);
                      formik.setFieldValue("githubReposUrl", user.repos_url);
                      formik.setFieldValue("githubUserEmail", user.email);
                    }}
                  >
                    {user.login}
                  </DropdownItem>
                ))}
            </DropdownMenu>
          </Dropdown>

          <div className="mt-2">
            {collaborators.map((collaborator: Collaborator) => (
              <div
                key={collaborator.id}
                className="d-flex align-items-center justify-content-between rounded border p-3"
              >
                <div className="d-flex align-items-center">
                  <Image
                    src={collaborator.avatar_url}
                    alt="github user profile image"
                    width={20}
                    height={20}
                    className="rounded-circle"
                    style={{ objectFit: "cover", objectPosition: "center center" }}
                  />
                  <h5 style={{ marginTop: "10px", marginLeft: "5px" }}>{collaborator.username}</h5>
                  <Link href={collaborator.github_url}>
                    <h6 style={{ marginTop: "10px" }}>
                      <small>({collaborator.username})</small>
                    </h6>
                  </Link>
                </div>
                <div className="d-flex">
                  <FormGroup className="col-12" style={{ width: "80%" }} name="defaultSelect">
                    <Select
                      id="defaultSelect"
                      ariaLabel="Default select example"
                      defaultValue={collaborator.is_admin ? "1" : "2"}
                      onChange={(e: any) => handleRoleChange(collaborator, e.target.value)}
                    >
                      <Option value="1">Admin</Option>
                      <Option value="2">User</Option>
                    </Select>
                  </FormGroup>
                  <div className="col-auto">
                    <Button
                      color="danger"
                      isLink
                      icon="Delete"
                      shadow="none"
                      hoverShadow="lg"
                      onClick={() => handleDeleteCollaborator(collaborator)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <hr style={{ margin: "5rem 0" }} />

      {/*Public Access */}

      <div className="row">
        <div className="col-md-6">
          <div className="d-flex align-items-center">
            <Icon icon="Public" className="" color="dark" size="2x" forceFamily={null} />

            <h2 style={{ marginLeft: "10px" }}>Public Access</h2>
          </div>
          <div style={{ width: "50%" }}>
            <small>
              Expose the Builds page publicly, allowing visitors to connect to your development
              builds.
            </small>
          </div>
        </div>
        <div className="col-md-6">
          <Checks
            id="flexCheckDefault"
            label="Allow public access"
            name="allowPublicAccess"
            onChange={formik.handleChange}
            checked={formik.values.allowPublicAccess}
          />
        </div>
      </div>
      <hr style={{ margin: "5rem 0" }} />

      {/*Submodules */}

      <div className="row">
        <div className="col-md-6">
          <div className="d-flex align-items-center">
            <Icon icon="Public" className="" color="dark" size="2x" forceFamily={null} />

            <h2 style={{ marginLeft: "10px" }}>Submodules</h2>
          </div>
        </div>
        <div className="col-md-6">
          <Alert color="warning" isLight>
            These settings are required for private repositories only. <br />
            <br /> If you are looking for some instructions on how to set up your submodules, please{" "}
            <Link href="#">check out the documentation.</Link>
          </Alert>
          <div style={{ marginTop: "3rem" }}>
            <small>
              <em>
                Enter the Git URL of your private submodule hereunder and click on Add.
                <br />
                Then copy the Public key and add it as a Deploy key in the repository settings of
                your Git hosting service.
                <br />
                <Icon icon="ArrowForward" />
                You can read <Link href="#"> our documentation </Link> for more specific
                instructions.
              </em>
            </small>
          </div>
          <InputGroup>
            <Input
              placeholder="git@github.com:acme/mii-theme.git"
              ariaLabel="Github subModule"
              ariaDescribedby="button-addon2"
              onChange={formik.handleChange}
              value={formik.values.githubSubModule}
              name="githubSubModule"
            />
            <Button color="success" id="githubSubModule" type="submit">
              Add
            </Button>
          </InputGroup>
        </div>
      </div>
      <hr style={{ margin: "5rem 0" }} />

      {/*Production Database Size */}

      <div className="row">
        <div className="col-md-6">
          <div className="d-flex align-items-center">
            <Icon icon="Public" className="" color="dark" size="2x" forceFamily={null} />

            <h2 style={{ marginLeft: "10px" }}>Production Database Size</h2>
          </div>
        </div>
        <div className="col-md-6">
          <div>
            This project's production database has a size of <strong>1.0 GB. </strong> It consists
            of its PSQL Database of
            <strong>20.7 MB </strong> and its{" "}
            <Tooltips
              title="The calculation of the container's file system storage includes the filestore, log files, custom code, session data and temporary files. This computation does not take into account the Odoo repositories (odoo, enterprise, themes) and the `backup.daily` folder"
              isDisableElements
              isDisplayInline
            >
              <span style={{ color: "blue" }}>container filesystem</span>
            </Tooltips>{" "}
            of
            <strong> 1007.5 MB.</strong> Please note the sizes displayed here are not real time.
            <br />
            <br />
            The price per GB is fixed at <strong> $0.25</strong> per month. The natural database
            growth will automatically be synchronized with your subscription. You can provision more
            space should you need it for a large database import. The default shared hosting offer
            provides up to 512 GB of storage, while the dedicated server offer increases this limit
            to 4096 GB.
          </div>
          <div>
            <Accordion
              id="showDetails"
              tag="section"
              shadow="default"
              isFlush={false}
              color="light"
            >
              <AccordionItem
                id="details"
                title="Show details"
                headerTag="span"
                overWriteColor="primary"
              >
                <Card stretch>
                  <CardBody>
                    <ListGroup>
                      <ListGroupItem>
                        <div className="d-flex justify-content-between">
                          Production Database
                          <span>1.0 GB</span>
                        </div>
                      </ListGroupItem>
                      <ListGroupItem>
                        <div className="d-flex justify-content-between">
                          Backup 1 - Europe (France)
                          <span>1.0 GB</span>
                        </div>
                      </ListGroupItem>
                      <ListGroupItem>
                        <div className="d-flex justify-content-between">
                          Backup 2 - Europe (France)
                          <span>1.0 GB</span>
                        </div>
                      </ListGroupItem>
                      <ListGroupItem>
                        <div className="d-flex justify-content-between">
                          Backup 3 - America (Canada)
                          <span>1.0 GB</span>
                        </div>
                      </ListGroupItem>
                      <ListGroupItem>
                        <div className="d-flex justify-content-between">
                          Staging Builds
                          <span>2.0 GB</span>
                        </div>
                      </ListGroupItem>
                      <ListGroupItem>
                        <div className="d-flex justify-content-between" style={{ color: "gray" }}>
                          Other Builds (Free)
                          <span>0 KB</span>
                        </div>
                      </ListGroupItem>
                      <ListGroupItem>
                        <div className="d-flex justify-content-between">
                          <strong>Total accounted storage</strong>
                          <strong>
                            <span>6.0 GB</span>
                          </strong>
                        </div>
                      </ListGroupItem>
                    </ListGroup>
                  </CardBody>
                </Card>
              </AccordionItem>
            </Accordion>
          </div>
          <Alert color="info" isLight className="mt-3">
            Trial project builds are limited to 1 GB in storage.
          </Alert>
        </div>
      </div>
      <hr style={{ margin: "5rem 0" }} />

      {/*Staging Branches */}

      <div className="row">
        <div className="col-md-6">
          <div className="d-flex align-items-center">
            <Icon icon="Public" className="" color="dark" size="2x" forceFamily={null} />

            <h2 style={{ marginLeft: "10px" }}>Staging Branches</h2>
          </div>
          <div style={{ width: "50%" }}>
            <small>
              Staging branches allow you to test and validate features with production data.
            </small>
          </div>
        </div>
        <div className="col-md-6">
          <div key="number" className="col-12">
            <FormGroup
              id={`exampleTypes--number`}
              label="Staging Branches"
              formText={<>Staging Branch(es)</>}
              isColForLabel
              labelClassName="col-sm-2 text-capitalize"
              childWrapperClassName="col-sm-10"
            >
              <Input
                type="number"
                aria-label=".form-control-lg example"
                onChange={formik.handleChange}
                value={formik.values.stagingBranches}
                name="stagingBranches"
              />
            </FormGroup>
          </div>
        </div>
      </div>
      <hr style={{ margin: "5rem 0" }} />

      {/*Delete Project*/}
      <div className="row">
        <div className="col-md-6"></div>
        <div className="col-md-6 d-flex justify-content-end">
          <div>
            <Button color="danger" isDisable={isLoadingDeleteProject} onClick={() => toggleAlert()}>
              Delete project
            </Button>
          </div>
        </div>
      </div>
      <br />
      {showAlert && (
        <Alert color="danger" isLight className="d-block p-3">
          <div className="row">
            <div className="col-md-8">
              <span>
                This action will permanently delete the project <strong>{name} </strong> and its
                builds, including the <strong>production datase. </strong> <br />
                This action <strong>CANNOT</strong> be undone .
              </span>
              <Input
                placeholder={`type the name "${name}" to confirm`}
                onChange={(e: any) => {
                  formik.handleChange(e);
                  const confirmationName = e.target.value;
                  setIsDeleteButtonEnabled(confirmationName === name);
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
                  isDisable={isLoadingDeleteProject}
                  onClick={() => toggleAlert()}
                >
                  Abort deleting
                </Button>

                <Button
                  color="danger"
                  isOutline
                  icon="warning"
                  isDisable={!isDeleteButtonEnabled || isLoadingDeleteProject}
                  onClick={() => handleDeleteProject()}
                >
                  <span style={{ marginRight: "0.5rem" }}>Delete Project</span>
                  {isLoadingDeleteProject && <Spinner color="danger" isSmall />}
                </Button>
              </div>
            </div>
          </div>
        </Alert>
      )}
    </Page>
  );
};

export default ProjectSettings;

// _____________________________________DO NOT DELETE BELOW_____________________________________________

// import { useFormik } from "formik";
// import { useRouter } from "next/router";
// import { useEffect, useState } from "react";
// import { ToastContainer } from "react-toastify";
// import Page from "../../../../layout/Page/Page";
// import useDeleteProject from "../../../../hooks/useDeleteProject";
// import ProjectName from "../../../../components/projectSettingsPage/ProjectName";
// import Collaborators from "../../../../components/projectSettingsPage/Collaborators";
// import DeleteProject from "../../../../components/projectSettingsPage/DeleteProject";
// import PublicAccess from "../../../../components/projectSettingsPage/PublicAccess";
// import Submodules from "../../../../components/projectSettingsPage/Submodules";
// import DatabaseSize from "../../../../components/projectSettingsPage/DatabaseSize";
// import StagingBranches from "../../../../components/projectSettingsPage/StagingBranches";

// const ProjectSettings = () => {
//   const router = useRouter();
//   const { name } = router.query;
//   const [showAlert, setShowAlert] = useState(false);
//   const [isDeleteButtonEnabled, setIsDeleteButtonEnabled] = useState(false);
//   const { deleteProject, isLoadingDeleteProject } = useDeleteProject();

//   let selectedProjectId: any;
//   try {
//     selectedProjectId = localStorage.getItem("projectId");
//   } catch (error) {
//     console.error("error in localStorage", error);
//   }

//   const formik = useFormik({
//     initialValues: {
//       confirmationName: "",
//       githubUsername: "",
//       githubAvatarUrl: "",
//       githubHtmlUrl: "",
//       githubReposUrl: "",
//       exampleUrl: "",
//       allowPublicAccess: false,
//       githubSubModule: "",
//       stagingBranches: 0,
//     },
//     onSubmit: (values) => {},
//   });

//   return (
//     <Page>
//       <ToastContainer />
//       <ProjectName formik={formik} />
//       <Collaborators formik={formik} selectedProjectId={selectedProjectId} />
//       <PublicAccess formik={formik} />
//       <Submodules formik={formik} />
//       <DatabaseSize />
//       <StagingBranches formik={formik} />
//       <DeleteProject
//         showAlert={showAlert}
//         setShowAlert={setShowAlert}
//         isDeleteButtonEnabled={isDeleteButtonEnabled}
//         setIsDeleteButtonEnabled={setIsDeleteButtonEnabled}
//         formik={formik}
//         name={name}
//         isLoadingDeleteProject={isLoadingDeleteProject}
//         deleteProject={deleteProject}
//       />
//     </Page>
//   );
// };

// export default ProjectSettings;
