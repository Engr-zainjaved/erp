import React, { FC } from "react";
import Icon from "../icon/Icon";
import Checks from "../bootstrap/forms/Checks";
import { FormikProps } from "formik";

interface PublicAccessProps {
  formik: FormikProps<any>;
}

const PublicAccess: FC<PublicAccessProps> = ({ formik }) => {
  return (
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
      <hr style={{ margin: "5rem 0" }} />
    </div>
  );
};

export default PublicAccess;
