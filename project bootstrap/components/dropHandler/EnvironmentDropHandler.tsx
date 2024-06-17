import React, { useRef, useState } from "react";
import DropHandler from "./DropHandler";
import Select from "../bootstrap/forms/Select";
import Input from "../bootstrap/forms/Input";
import { useDrop } from "react-dnd";
import { useFormik } from "formik";
import Spinner from "../bootstrap/Spinner";

interface Branch {
  id: number;
  name: string;
}

interface EnvironmentDropHandlerProps {
  environment: string;
  environmentId: any;
  allBranches: Branch[];
  onDrop: (branchId: number) => void;
  formik: ReturnType<typeof useFormik>;
  stageChange: (draggedBranchId: any, targetBranchId: any) => void;
  onEnvironmentChange: (environmentId: number) => void;
  isLoading: any;
  isCreateNewBranchLoading: any;
}

const EnvironmentDropHandler: React.FC<EnvironmentDropHandlerProps> = ({
  environment,
  environmentId,
  allBranches,
  onDrop,
  formik,
  stageChange,
  onEnvironmentChange,
  isLoading,
  isCreateNewBranchLoading,
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: "LIST_ITEM",
    drop: (item: { branchId: number }) => {
      onDrop(item.branchId);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });
  const selectRef = useRef<any>(null);
  const [isLocalLoading, setLocalLoading] = useState(false);

  return (
    <DropHandler
      environment={environment}
      environmentId={environmentId}
      stageChange={stageChange}
      isLoading={isLoading}
    >
      <div className="d-flex align-items-center mb-3">
        <div style={{ color: "white", marginRight: "10px" }}>Fork</div>
        <Select
          key={environmentId}
          ref={selectRef}
          id="existingBranchName"
          ariaLabel="Default select example"
          value={formik.values?.[`existingBranchName-${environment}`]}
          disabled={isCreateNewBranchLoading}
          list={allBranches.map((branch) => ({
            value: branch.id,
            text: branch.name,
          }))}
          onChange={(event: any) => {
            const selectedValue = event.target.value;
            formik.setFieldValue(`existingBranchName`, selectedValue);
            onEnvironmentChange(environmentId);
          }}
        />
      </div>
      <div className="d-flex align-items-center">
        <div style={{ color: "white", marginRight: "10px" }}>To</div>
        <Input
          id={`newBranchName-${environment}`}
          name={`newBranchName-${environment}`}
          placeholder="enter"
          aria-label={`newBranchName-${environment}`}
          autoComplete={`newBranchName-${environment}`}
          ariaDescribedby="addon1"
          onChange={formik.handleChange}
          value={formik.values[`newBranchName-${environment}`]}
          disabled={isCreateNewBranchLoading}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              const inputValue = (event.target as HTMLInputElement).value;
              formik.values.selectedEnvironment = environmentId;
              formik.setFieldValue(`newBranchName`, inputValue);
              setLocalLoading(true);
              setTimeout(() => {
                formik.handleSubmit();
                formik.resetForm();
                selectRef.current.value = "";
                setTimeout(() => {
                  setLocalLoading(false);
                }, 1000);
              }, 0);
            }
          }}
          style={{ width: "100%" }}
        />
      </div>
      <div>
        {isLocalLoading ? (
          <div style={{ marginTop: "15px" }}>
            <Spinner size="1.2rem" color="light" />
            <span style={{ color: "white", marginLeft: "10px" }}>creating branch</span>
          </div>
        ) : (
          ""
        )}
      </div>
    </DropHandler>
  );
};

export default EnvironmentDropHandler;
