import { FC } from "react";
import { FormikProps } from "formik";
import InputGroup, { InputGroupText } from "../bootstrap/forms/InputGroup";
import Input from "../bootstrap/forms/Input";
import Icon from "../icon/Icon";
import Button from "../bootstrap/Button";

interface ProjectNameProps {
  formik: FormikProps<any>;
}

const ProjectName: FC<ProjectNameProps> = ({ formik }) => (
  <div className="row">
    <div className="col-md-6">
      <div className="d-flex align-items-center">
        <Icon icon="Public" color="dark" size="2x" forceFamily={null} />
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
    <hr style={{ margin: "5rem 0" }} />
  </div>
);

export default ProjectName;
