import { FormikProps } from "formik";
import React, { FC } from "react";
import Button from "../bootstrap/Button";
import Alert from "../bootstrap/Alert";
import Input from "../bootstrap/forms/Input";
import Spinner from "../bootstrap/Spinner";

interface DeleteProjectProps {
  showAlert: boolean;
  setShowAlert: (value: boolean) => void;
  isDeleteButtonEnabled: boolean;
  setIsDeleteButtonEnabled: (value: boolean) => void;
  formik: FormikProps<any>;
  name: any;
  isLoadingDeleteProject: boolean;
  deleteProject: any;
}

const DeleteProject: FC<DeleteProjectProps> = ({
  showAlert,
  setShowAlert,
  isDeleteButtonEnabled,
  setIsDeleteButtonEnabled,
  formik,
  name,
  isLoadingDeleteProject,
  deleteProject,
}) => {
  const toggleAlert = () => setShowAlert(!showAlert);

  const handleDeleteProject = () => {
    deleteProject();
  };

  return (
    <div className="row">
      <div className="col-md-6"></div>
      <div className="col-md-6 d-flex justify-content-end">
        <div>
          <Button color="danger" isDisable={isLoadingDeleteProject} onClick={toggleAlert}>
            Delete project
          </Button>
        </div>
      </div>
      <br />
      {showAlert && (
        <Alert color="danger" isLight className="d-block p-3">
          <div className="row">
            <div className="col-md-8">
              <span>
                This action will permanently delete the project <strong>{name} </strong> and its
                builds, including the <strong>production database. </strong> <br />
                This action <strong>CANNOT</strong> be undone.
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
                  onClick={toggleAlert}
                >
                  Abort deleting
                </Button>

                <Button
                  color="danger"
                  isOutline
                  icon="warning"
                  isDisable={!isDeleteButtonEnabled || isLoadingDeleteProject}
                  onClick={handleDeleteProject}
                >
                  <span style={{ marginRight: "0.5rem" }}>Delete Project</span>
                  {isLoadingDeleteProject && <Spinner color="danger" isSmall />}
                </Button>
              </div>
            </div>
          </div>
        </Alert>
      )}
    </div>
  );
};

export default DeleteProject;
