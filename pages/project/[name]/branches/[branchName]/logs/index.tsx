import { useEffect, useRef, useState } from "react";
import request from "../../../../../../common/lib/axios";
import Card, { CardBody } from "../../../../../../components/bootstrap/Card";
import ListGroup, { ListGroupItem } from "../../../../../../components/bootstrap/ListGroup";
import Option from "../../../../../../components/bootstrap/Option";
import Select from "../../../../../../components/bootstrap/forms/Select";
import Page from "../../../../../../layout/Page/Page";
import Alert from "../../../../../../components/bootstrap/Alert";
import Spinner from "../../../../../../components/bootstrap/Spinner";
import InputGroup, {
  InputGroupText,
} from "../../../../../../components/bootstrap/forms/InputGroup";
import Input from "../../../../../../components/bootstrap/forms/Input";
import { useFormik } from "formik";
import Button from "../../../../../../components/bootstrap/Button";

type Log = string;

const ProjectBranchLogs = () => {
  const [selectedLogType, setSelectedLogType] = useState("1");
  const [alertMessage, setAlertMessage] = useState<string | null>();
  const [spinner, setSpinner] = useState(false);
  const [logs, setLogs] = useState<Log[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<Log[]>([]);
  const [searchPerformed, setSearchPerformed] = useState(false);

  let branchId: any;
  try {
    branchId = localStorage.getItem("branchId");
  } catch {
    console.error("error in LS for Logs page");
  }

  const formik = useFormik({
    initialValues: {
      errorFilter: "",
    },
    onSubmit: (values) => {
      setSearchPerformed(true);
      const searchText = values.errorFilter.toLowerCase();
      const filtered = logs.filter((log) => log.toLowerCase().includes(searchText));
      setFilteredLogs(filtered);
    },
  });

  const handleInputChange = (event: any) => {
    const searchText = event.target.value.toLowerCase();
    const filtered = logs.filter((log) => log.toLowerCase().includes(searchText));
    setFilteredLogs(filtered);
    setSearchPerformed(false);
  };

  const logTypes: Record<string, { value: string; api: string; label: string }> = {
    odoo: {
      value: "1",
      api: "/builds/app-logs",
      label: "odoo.log",
    },
    build: {
      value: "2",
      api: "/builds/build-logs",
      label: "build.log",
    },
  };

  let intervalId: any;
  useEffect(() => {
    if (branchId) {
      getLogs("odoo");
      intervalId = setInterval(() => {
        getLogs("odoo");
      }, 5000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [branchId]);

  useEffect(() => {
    const intervalId2 = setInterval(() => {
      getLogs(selectedLogType);
    }, 10000);

    return () => {
      clearInterval(intervalId2);
      clearInterval(intervalId);
    };
  }, [selectedLogType]);

  const getLogs = (logType: keyof typeof logTypes) => {
    setSpinner(true);
    let previousBranchLogs: any = null;
    setAlertMessage(null);

    if (branchId && logTypes[logType]) {
      const apiUrl = `${logTypes[logType].api}/${branchId}`;
      request
        .get(apiUrl)
        .then((response) => {
          const branchLogs = response.data.data;
          if (JSON.stringify(branchLogs) !== JSON.stringify(previousBranchLogs)) {
            setLogs(branchLogs);
          }
          previousBranchLogs = branchLogs;
        })
        .catch((reason: any) => {
          if (reason.status === 500) {
            setAlertMessage("Status code: 500 - Backend API failed");
          } else {
            setAlertMessage(reason?.data?.message);
          }
          setLogs([]);
        })
        .finally(() => {
          setSpinner(false);
        });
    }
  };

  const handleLogTypeChange = (event: any) => {
    const newLogTypeValue = event.target.value;
    const selectedLogTypeKey = Object.keys(logTypes).find(
      (key) => logTypes[key].value === newLogTypeValue
    );

    if (selectedLogTypeKey && selectedLogType !== selectedLogTypeKey) {
      setSelectedLogType(selectedLogTypeKey);
      getLogs(selectedLogTypeKey);

      clearInterval(intervalId);
    }
  };

  return (
    <Page>
      <br style={{ marginTop: "5rem" }} />

      <ListGroup>
        <ListGroupItem>
          <div>
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <span style={{ marginRight: "10px" }}>Available logs:</span>
                <div style={{ width: "200px" }}>
                  <Select
                    id="defaultSelect"
                    ariaLabel="Default select example"
                    onChange={handleLogTypeChange}
                    value={logTypes[selectedLogType]?.value || ""}
                  >
                    {Object.values(logTypes).map((log) => (
                      <Option key={log.value} value={log.value}>
                        {log.label}
                      </Option>
                    ))}
                  </Select>
                </div>
                {spinner && (
                  <div style={{ marginLeft: "10px" }}>
                    <Spinner color="success" />
                  </div>
                )}
              </div>
              <div>
                <form onSubmit={formik.handleSubmit}>
                  <InputGroup>
                    <InputGroupText id="addon1">Filter :</InputGroupText>
                    <Input
                      id="errorFilter"
                      name="errorFilter"
                      placeholder="ERROR"
                      aria-label="errorFilter"
                      autoComplete="errorFilter"
                      ariaDescribedby="addon1"
                      onChange={(event) => {
                        formik.handleChange(event);
                        handleInputChange(event);
                      }}
                      value={formik.values.errorFilter}
                      onKeyPress={(event) => {
                        if (event.key === "Enter") {
                          formik.handleSubmit();
                          event.preventDefault();
                        }
                      }}
                    />
                    <Button type="submit" color={"light"}>
                      Search
                    </Button>
                  </InputGroup>
                </form>
              </div>
            </div>
          </div>
        </ListGroupItem>
      </ListGroup>

      <Card className="mt-3" shadow="md" borderSize={null} borderColor="dark">
        <CardBody className="px-3">
          <div>
            {searchPerformed && filteredLogs.length === 0 ? (
              <p>No search results found</p>
            ) : filteredLogs.length > 0 ? (
              filteredLogs.map((log, index) => <p key={index}>{log}</p>)
            ) : (
              logs.map((log, index) => <p key={index}>{log}</p>)
            )}
            {alertMessage && (
              <Alert color="danger" isLight>
                {alertMessage}
              </Alert>
            )}
          </div>
        </CardBody>
      </Card>
    </Page>
  );
};

export default ProjectBranchLogs;
