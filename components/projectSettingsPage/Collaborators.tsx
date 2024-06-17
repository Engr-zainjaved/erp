import { FC, useState, useEffect } from "react";
import { FormikProps } from "formik";
import Image from "next/image";
import { PAT } from "../../common/data/personalAccessToken";
import request from "../../common/lib/axios";
import Icon from "../icon/Icon";
import Dropdown, { DropdownItem, DropdownMenu, DropdownToggle } from "../bootstrap/Dropdown";
import Input from "../bootstrap/forms/Input";
import FormGroup from "../bootstrap/forms/FormGroup";
import Option from "../bootstrap/Option";
import Select from "../bootstrap/forms/Select";
import Button from "../bootstrap/Button";

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
}

interface Collaborator {
  id: number;
  username: string;
  is_admin: boolean;
  avatar_url: string;
  github_url: string;
}

interface CollaboratorsProps {
  formik: FormikProps<any>;
  selectedProjectId: string;
}

const Collaborators: FC<CollaboratorsProps> = ({ formik, selectedProjectId }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [users, setUsers] = useState<GitHubUser[]>([]);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  // const { addToast } = useToast();

  const fetchGitHubUsers = async (e: any) => {
    formik.handleChange(e);
    const query = e.target.value;
    const limit = 3;
    const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN || PAT;

    const url = `https://api.github.com/search/users?q=${query}&per_page=${limit}`;

    if (query.length > 0) {
      try {
        const response = await request.get(url, {
          headers: {
            Authorization: `token ${token}`,
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
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const handleDeleteCollaborator = async (collaborator: Collaborator) => {
    try {
      await request.delete(
        `/api/v1/user/project/${selectedProjectId}/collaborators/${collaborator.id}/`
      );

      setCollaborators((prevCollaborators) =>
        prevCollaborators.filter((c) => c.id !== collaborator.id)
      );
    } catch (error) {
      console.error("Error deleting collaborator:", error);
    }
  };

  const addCollaborator = async () => {
    try {
      const { githubUsername, githubAvatarUrl, githubHtmlUrl, githubReposUrl, role } =
        formik.values;
      const isAdmin = role === "1";

      const response = await request.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/user/project/${selectedProjectId}/collaborators/`,
        {
          username: githubUsername,
          avatar_url: githubAvatarUrl,
          html_url: githubHtmlUrl,
          repos_url: githubReposUrl,
          is_admin: isAdmin,
        }
      );

      setCollaborators([...collaborators, response.data]);

      // Clear the form fields
      formik.resetForm();
    } catch (error) {
      console.error("Error adding collaborator:", error);
    }
  };

  useEffect(() => {
    fetchCollaborators();
  }, [selectedProjectId]);

  return (
    <div className="row">
      <div className="col-md-6">
        <div className="d-flex align-items-center">
          <Icon icon="Public" color="dark" size="2x" forceFamily={null} />
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
            <Input
              placeholder="Github username"
              id="githubUsername"
              ariaDescribedby="addon3"
              onChange={fetchGitHubUsers}
              value={formik.values.githubUsername}
              name="githubUsername"
            />
          </DropdownToggle>
          <DropdownMenu style={{ width: "100%" }}>
            {users.map((user) => (
              <DropdownItem
                key={user.id}
                onClick={() => {
                  formik.setFieldValue("githubUsername", user.login);
                  formik.setFieldValue("githubAvatarUrl", user.avatar_url);
                  formik.setFieldValue("githubHtmlUrl", user.html_url);
                  formik.setFieldValue("githubReposUrl", user.repos_url);
                  setDropdownOpen(false);
                }}
              >
                <div className="d-flex align-items-center">
                  <Image
                    alt={user.login}
                    src={user.avatar_url}
                    width={20}
                    height={20}
                    className="rounded-circle mr-2"
                  />
                  <span>{user.login}</span>
                </div>
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
        <FormGroup>
          <div style={{ width: "50%" }}>
            <Select
              id="role"
              ariaLabel="change collaborator role"
              placeholder="Select Role"
              onChange={(e: any) => formik.setFieldValue("role", e.target.value)}
              value={formik.values.role}
              name="role"
            >
              <Option value="1">Admin</Option>
              <Option value="0">User</Option>
            </Select>
          </div>
          <Button
            color="success"
            size="sm"
            rounded="default"
            shadow="default"
            hoverShadow="default"
            tag="button"
            type="button"
            onClick={addCollaborator}
          >
            Add Collaborator
          </Button>
        </FormGroup>
      </div>
      <hr style={{ margin: "5rem 0" }} />
    </div>
  );
};

export default Collaborators;
