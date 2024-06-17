import React, { FC } from "react";
import Icon from "../icon/Icon";
import Alert from "../bootstrap/Alert";
import Link from "next/link";
import InputGroup from "../bootstrap/forms/InputGroup";
import Input from "../bootstrap/forms/Input";
import Button from "../bootstrap/Button";
import { FormikProps } from "formik";

interface SubmoduleProps {
  formik: FormikProps<any>;
}

const Submodule: FC<SubmoduleProps> = ({ formik }) => {
  return (
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
              Then copy the Public key and add it as a Deploy key in the repository settings of your
              Git hosting service.
              <br />
              <Icon icon="ArrowForward" />
              You can read <Link href="#"> our documentation </Link> for more specific instructions.
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
          <Button
            color="success"
            id="githubSubModule"
            type="button"
            onClick={() => {
              /* Handle add submodule logic here */
            }}
          >
            Add
          </Button>
        </InputGroup>
      </div>
      <hr style={{ margin: "5rem 0" }} />
    </div>
  );
};

export default Submodule;
