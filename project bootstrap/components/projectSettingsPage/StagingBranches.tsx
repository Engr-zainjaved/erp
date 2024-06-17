import { FormikProps } from "formik";
import { FC } from "react";
import Icon from "../icon/Icon";
import FormGroup from "../bootstrap/forms/FormGroup";
import Input from "../bootstrap/forms/Input";

interface PublicAccessProps {
  formik: FormikProps<any>;
}

const StagingBranches: FC<PublicAccessProps> = ({ formik }) => {
  return (
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
      <hr style={{ margin: "5rem 0" }} />
    </div>
  );
};

export default StagingBranches;
