import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Card, { CardBody } from "../../../../../../components/bootstrap/Card";

import { useFormik } from "formik";
import { handleApiSuccess } from "../../../../../../common/function/apiHelper/apiSuccess";
import request from "../../../../../../common/lib/axios";
import PaginationButtons, { dataPagination } from "../../../../../../components/PaginationButtons";
import Alert from "../../../../../../components/bootstrap/Alert";
import Button, { ButtonGroup } from "../../../../../../components/bootstrap/Button";
import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "../../../../../../components/bootstrap/Modal";
import Spinner from "../../../../../../components/bootstrap/Spinner";
import FormGroup from "../../../../../../components/bootstrap/forms/FormGroup";
import Input from "../../../../../../components/bootstrap/forms/Input";
import Select from "../../../../../../components/bootstrap/forms/Select";
import Icon from "../../../../../../components/icon/Icon";
import { useProjectContext } from "../../../../../../context/projectContext";
import useSelectTable from "../../../../../../hooks/useSelectTable";
import useSortableData from "../../../../../../hooks/useSortableData";
import Page from "../../../../../../layout/Page/Page";
import useDownloadDatabaseDumpApi from "../../../../../../hooks/useDownloadDatabaseDumpApi";
import { toast } from "react-toastify";
import { number } from "prop-types";
import useS3FileUpload from "../../../../../../hooks/useS3FileUpload";
import useIsZipFile from "../../../../../../hooks/useIsZipFile";
import useImportDatabase from "../../../../../../hooks/useImportDatabase";
import useImportExportEnableStatusApi from "../../../../../../hooks/useImportExportEnableStatusApi";
import Popovers from "../../../../../../components/bootstrap/Popovers";

interface PlatformEvent {
  id: number;
  event_description: string;
  event_verbose: string;
  event_type: string;
  date_created: string;
  committer: {
    username: string;
    avatar: string;
  };
  source: "platform";
}

interface GitHubEvent {
  committer: {
    name: string;
    username: string;
    avatar: string;
  };
  commit: {
    title: string;
    message: string;
    url: string;
  };
  source: "github";
  last_modified: string;
  date_created: string;
}

const ProjectDetail = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(3);
  const [createBackupModalState, setCreateBackupModalState] = useState(false);
  const [importDatabaseState, setImportDatabaseState] = useState(false);
  const [uploadDatabaseState, setUploadDatabaseState] = useState(false);
  const [downloadOptionsState, setDownloadOptionsState] = useState(false);
  const [deleteOptionsState, setDeleteOptionsState] = useState(false);
  const [preSignedUrl, SetPreSignedUrl] = useState();
  const [restoreOptionsState, setRestoreOptionsState] = useState({
    isOpen: false,
    selectedDate: null,
  });
  const [branchBackupList, setBranchBackupList] = useState<any>([]);
  const [promiseLoading, setPromiseLoading] = useState(false);
  const [backupId, setBackupId] = useState();
  const { branchId, branchData, websocketRealTimeData, isbuildActiveStatus } = useProjectContext();
  const { items, requestSort, getClassNamesFor } = useSortableData(branchBackupList);
  const onCurrentPageData = dataPagination(items, currentPage, perPage);
  const { selectTable, SelectAllCheck } = useSelectTable(onCurrentPageData);
  const router = useRouter();
  const { name, branchName } = router.query;
  const { isZipFile, validateFileType } = useIsZipFile();
  const { isLoadingDownloadDatabaseDumpApi, downloadDatabaseDump } =
    useDownloadDatabaseDumpApi(setDownloadOptionsState);
  const { uploadFileToS3, isLoadinguploadFileToS3 } = useS3FileUpload();
  const { importDatabase, isLoadingImportDatabase } = useImportDatabase();
  const { importExportEnableStatusApi, isEnableImportExport } = useImportExportEnableStatusApi();
  let selectedProjectId: any;
  let selectedBranchId: any;
  try {
    selectedProjectId = localStorage.getItem("projectId");
    selectedBranchId = localStorage.getItem("branchId");
  } catch {
    console.error("error in accessing projectId on backups page");
  }

  // Function to update branch status based on WebSocket data
  const updateBranchStatus = (updatedItem: any) => {
    setBranchBackupList((prevList: any) => {
      return prevList.map((item: any) => {
        if (item.id === updatedItem.id) {
          return {
            ...item,
            status: updatedItem.status,
          };
        } else {
          return item;
        }
      });
    });
  };

  useEffect(() => {
    if (websocketRealTimeData) {
      updateBranchStatus(websocketRealTimeData);
    }
    if (selectedProjectId && selectedBranchId) {
      importExportEnableStatusApi(selectedProjectId, selectedBranchId);
    }
  }, [websocketRealTimeData]);

  const formik = useFormik({
    onSubmit: (values, formikHelpers) => {},
    initialValues: {
      comment: "",
      customerName: "",
      service: "Exercise Bike",
      employee: `Noman Jallal`,
      location: "Maryland",
      time: "10:30",
      note: "lorem ipseum",
      notify: true,
      dumpType: "exact",
      filestore: "withFilestore",
      repoSelection: "local_file",
      databaseFile: undefined,
      databaseUrl: "",
      restoreBranchId: number,
    },
  });

  const handleImport = async () => {
    if (formik.values.repoSelection === "local_file") {
      if (!formik.values.databaseFile) {
        return;
      }

      const formData = new FormData();
      formData.append("file", formik.values.databaseFile);
      const file: File = formik.values.databaseFile as File;
      uploadFileToS3(
        file.name,
        file,
        // forDetailProjectId,
        selectedProjectId,
        branchId,
        formik.values.repoSelection
      ).then(() => {
        router.push(`/project/${name}/branches/${branchName}/history`);
      });
      formik.resetForm();
      !isLoadinguploadFileToS3 && setUploadDatabaseState(false);
    } else if (formik.values.repoSelection === "hosted_file") {
      importDatabase(
        // forDetailProjectId,
        selectedProjectId,
        branchId,
        formik.values.repoSelection,
        formik.values.databaseUrl
      )
        .then(() => {
          router.push(`/project/${name}/branches/${branchName}/history`);
        })
        .finally(() => {
          formik.resetForm();
          setUploadDatabaseState(false);
        });
    }
  };

  const handledownloadDatabaseDump = () => {
    const downloadType =
      formik.values.filestore === "withFilestore" ? "with_filestore" : "without_filestore";

    if (backupId !== undefined) {
      downloadDatabaseDump(selectedProjectId, branchId, backupId, downloadType);
    } else {
      toast.error("backupId is undefined", { autoClose: 5000, theme: "colored" });
    }
  };

  const handleFileUpload = (event: any) => {
    const file = event.target.files[0];
    formik.setFieldValue("databaseFile", file);
    validateFileType(file);
  };

  const handleUrlChange = (event: any) => {
    const { value } = event.target;
    formik.setFieldValue("databaseUrl", value);
  };

  const branchDataAvailable = branchData && branchData.data && branchData.data.data;

  const productionBranches = branchDataAvailable ? branchData.data.data.Production.branches : [];

  const stagingBranches = branchDataAvailable ? branchData.data.data.Staging.branches : [];

  const branchOptions = [...productionBranches, ...stagingBranches].map((branch) => ({
    value: branch.id,
    label: branch.name,
  }));

  const fetchBranchBackup = async () => {
    try {
      if (branchId) {
        const apiUrl = `/user/project/${selectedProjectId}/branches/${branchId}/backups/`;
        const response = await request.get(apiUrl);
        setBranchBackupList(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBranchBackup();
  }, [branchId]);

  const handleCreateBackup = async () => {
    try {
      setPromiseLoading(true);
      setCreateBackupModalState(false);
      const apiUrl = `/user/project/${selectedProjectId}/branches/${branchId}/backups/`;
      const response = await request.post(apiUrl, {
        comment: formik.values.comment,
      });
      setPromiseLoading(false);
      formik.resetForm();
      handleApiSuccess(response);
      fetchBranchBackup();
    } catch (error) {
      formik.resetForm();
      setPromiseLoading(false);
    }
  };

  const handleRestoreBackup = async () => {
    try {
      setRestoreOptionsState({ isOpen: false, selectedDate: null });
      const apiUrl = `/user/project/${selectedProjectId}/branches/${branchId}/backups/${backupId}/restore/`;
      const restoreBranchId = formik.values.restoreBranchId;
      const requestBody = {
        branch: restoreBranchId,
      };
      const response = await request.post(apiUrl, requestBody);
      handleApiSuccess(response);
      router.push(`/project/${name}/branches/${branchName}/history`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter" && e.target.id === "backupComment") {
      e.preventDefault();
      handleCreateBackup();
    }
  };

  const handleRestoreOptionsState = (isOpen: boolean, selectedDate: any) => {
    setRestoreOptionsState({
      isOpen,
      selectedDate,
    });
  };

  const handleDeleteBackup = async () => {
    try {
      setPromiseLoading(true);
      const apiUrl = `/user/project/${selectedProjectId}/branches/${branchId}/backups/${backupId}`;
      const response = await request.delete(apiUrl);
      handleApiSuccess(response);
      setDeleteOptionsState(false);
      setPromiseLoading(false);
    } catch (error) {
      console.error(error);
      setDeleteOptionsState(false);
      setPromiseLoading(false);
    }
  };

  function formatFileSize(bytes: number): string {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "0 Byte";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
  }

  return (
    <>
      <Page>
        {true ? (
          <>
            <div className="d-flex justify-content-end mb-4">
              <Button
                color="light"
                style={{ marginRight: "10px" }}
                onClick={() => setCreateBackupModalState(true)}
                isDisable={!isEnableImportExport || !isbuildActiveStatus}
              >
                Create Backup
              </Button>
              <Button
                color="success"
                onClick={() => setImportDatabaseState(true)}
                isDisable={!isEnableImportExport || !isbuildActiveStatus}
              >
                Import Database
              </Button>
            </div>
            <div className="col-12">
              <Card>
                <CardBody>
                  <table className="table table-modern">
                    <thead>
                      <tr>
                        {/* <th style={{ width: 50 }}>{SelectAllCheck}</th> */}
                        <th
                          onClick={() => requestSort("firstName")}
                          className="cursor-pointer text-decoration-underline"
                        >
                          Time (UTC){" "}
                          <Icon
                            size="lg"
                            className={getClassNamesFor("firstName")}
                            icon="FilterList"
                          />
                        </th>
                        <th
                          onClick={() => requestSort("lastName")}
                          className="cursor-pointer text-decoration-underline"
                        >
                          Database name{" "}
                          <Icon
                            size="lg"
                            className={getClassNamesFor("lastName")}
                            icon="FilterList"
                          />
                        </th>
                        <th
                          onClick={() => requestSort("lastName")}
                          className="cursor-pointer text-decoration-underline"
                        >
                          Branch{" "}
                          <Icon
                            size="lg"
                            className={getClassNamesFor("lastName")}
                            icon="FilterList"
                          />
                        </th>
                        <th
                          onClick={() => requestSort("lastName")}
                          className="cursor-pointer text-decoration-underline"
                        >
                          Version{" "}
                          <Icon
                            size="lg"
                            className={getClassNamesFor("lastName")}
                            icon="FilterList"
                          />
                        </th>
                        <th
                          onClick={() => requestSort("lastName")}
                          className="cursor-pointer text-decoration-underline"
                        >
                          Size{" "}
                          <Icon
                            size="lg"
                            className={getClassNamesFor("lastName")}
                            icon="FilterList"
                          />
                        </th>
                        <th
                          onClick={() => requestSort("lastName")}
                          className="cursor-pointer text-decoration-underline"
                        >
                          Comment{" "}
                          <Icon
                            size="lg"
                            className={getClassNamesFor("lastName")}
                            icon="FilterList"
                          />
                        </th>
                        <th
                          onClick={() => requestSort("lastName")}
                          className="cursor-pointer text-decoration-underline"
                        >
                          Revision{" "}
                          <Icon
                            size="lg"
                            className={getClassNamesFor("lastName")}
                            icon="FilterList"
                          />
                          <th style={{ width: 50 }}></th>
                        </th>
                        <th
                          onClick={() => requestSort("lastName")}
                          className="cursor-pointer text-decoration-underline"
                        >
                          Status
                          <Icon
                            size="lg"
                            className={getClassNamesFor("lastName")}
                            icon="FilterList"
                          />
                          <th style={{ width: 50 }}></th>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {promiseLoading ? (
                        <tr>
                          <td>
                            <h5 className="card-title placeholder-glow">
                              <span className="placeholder col-6"></span>
                            </h5>
                          </td>
                          <td>
                            <h5 className="card-title placeholder-glow">
                              <span className="placeholder col-6"></span>
                            </h5>
                          </td>
                          <td>
                            <h5 className="card-title placeholder-glow">
                              <span className="placeholder col-6"></span>
                            </h5>
                          </td>
                          <td>
                            <h5 className="card-title placeholder-glow">
                              <span className="placeholder col-6"></span>
                            </h5>
                          </td>
                          <td>
                            <h5 className="card-title placeholder-glow">
                              <span className="placeholder col-6"></span>
                            </h5>
                          </td>
                          <td>
                            <h5 className="card-title placeholder-glow">
                              <span className="placeholder col-6"></span>
                            </h5>
                          </td>
                          <td>
                            <h5 className="card-title placeholder-glow">
                              <span className="placeholder col-6"></span>
                            </h5>
                          </td>
                        </tr>
                      ) : null}
                      {branchBackupList?.map((item: any) => (
                        <tr key={item.id}>
                          <td>{new Date(item.date_created).toLocaleString()}</td>
                          <td>{`${name}-${branchName}-${item.db_name}`}</td>
                          <td>{item.branch.name}</td>
                          <td>{item.version}</td>
                          <td>{formatFileSize(item.file_size)}</td>
                          <td>{item.comment}</td>
                          <td>{item.revision.slice(0, 8)}</td>
                          <td style={{ textAlign: "center" }}>
                            <div className="d-flex align-items-center">
                              {item?.status == "in_progress" ? (
                                <Spinner color="success" isSmall />
                              ) : item?.status == "success" ? (
                                "Success"
                              ) : item?.status == "backup_failed" ? (
                                "Failed"
                              ) : item?.status == "backup_succeed" ? (
                                "Success"
                              ) : (
                                item.status
                              )}
                              {item?.error_message && (
                                <Popovers desc={item?.error_message} trigger="hover">
                                  <Icon icon="Assistant" className="h5 m-2 text-danger" />
                                </Popovers>
                              )}
                            </div>
                          </td>
                          {item?.status == "in_progress" ||
                          item?.status == "backup_failed" ||
                          !isEnableImportExport ||
                          !isbuildActiveStatus ? (
                            <Popovers desc="disabled" trigger="click">
                              <ButtonGroup>
                                <Button
                                  icon="Dns"
                                  color="dark"
                                  isOutline
                                  isDisable={
                                    item?.status == "in_progress" ||
                                    item?.status == "backup_failed" ||
                                    !isEnableImportExport
                                  }
                                />
                                <Button
                                  icon="PublishedWithChanges"
                                  color="dark"
                                  isOutline
                                  isDisable={
                                    item?.status == "in_progress" ||
                                    item?.status == "backup_failed" ||
                                    !isEnableImportExport
                                  }
                                />
                              </ButtonGroup>
                            </Popovers>
                          ) : (
                            <ButtonGroup>
                              <Button
                                icon="Dns"
                                color="primary"
                                isOutline
                                onClick={() => {
                                  SetPreSignedUrl(item.pre_signed_url);
                                  setDownloadOptionsState(true);
                                  setBackupId(item.id);
                                }}
                              />
                              <Button
                                icon="PublishedWithChanges"
                                color="primary"
                                isOutline
                                onClick={() => {
                                  setRestoreOptionsState({
                                    isOpen: true,
                                    selectedDate: item.created_at,
                                  });
                                  setBackupId(item.id);
                                }}
                              />
                              <Button
                                icon="DeleteOutline"
                                color="danger"
                                isOutline
                                onClick={() => {
                                  setDeleteOptionsState(true);
                                  setBackupId(item.id);
                                }}
                              />
                            </ButtonGroup>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardBody>
                <PaginationButtons
                  data={items}
                  label="items"
                  setCurrentPage={setCurrentPage}
                  currentPage={currentPage}
                  perPage={perPage}
                  setPerPage={setPerPage}
                />
              </Card>
            </div>
          </>
        ) : (
          <div className="d-flex align-items-center justify-content-center">
            <Spinner tag="span" color="dark" size={"3rem"} />
          </div>
        )}
      </Page>

      <>
        {/* {Modals} */}

        {/* {Create Backup Modal} */}

        <Modal
          isOpen={createBackupModalState}
          setIsOpen={setCreateBackupModalState}
          titleId="createBackup"
          isStaticBackdrop={true}
          isScrollable={false}
          isCentered={false}
          size="lg"
          fullScreen={false}
          isAnimation={false}
        >
          <ModalHeader>
            <ModalTitle id="exampleModalLabel">Create Backup</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <div className="mb-3">
              You are about to create a manual backup of the "prod3" production branch's database.
              You may enter a short comment for this backup here below
            </div>
            <FormGroup id="backupComment" label="Backup Comment">
              <Input
                onChange={(e: any) => {
                  formik.handleChange(e);
                  formik.setFieldValue("comment", e.target.value);
                }}
                onKeyPress={handleKeyPress}
                value={formik.values.comment}
                placeholder="backup comments..."
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button
              color="info"
              isOutline
              className="border-0"
              onClick={() => {
                setCreateBackupModalState(false);
              }}
            >
              Discard
            </Button>
            <Button color="info" icon="Save" onClick={handleCreateBackup}>
              Create
            </Button>
          </ModalFooter>
        </Modal>

        {/* {Import Database Modal} */}

        <Modal
          isOpen={importDatabaseState}
          setIsOpen={setImportDatabaseState}
          titleId="createBackup"
          isStaticBackdrop={true}
          isScrollable={false}
          isCentered={false}
          size="lg"
          fullScreen={false}
          isAnimation={false}
        >
          <ModalHeader>
            <ModalTitle id="exampleModalLabel">Import your Database</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <div className="mb-3">
              <div style={{ fontWeight: "bold" }}>
                To import an existing on-premise Odoo database:
              </div>
              <div>
                <ol>
                  <li>Open the existing Odoo instance</li>
                  <li>Connect to it as the administrator</li>
                  <li>
                    Download a backup of the database with the database manager
                    (/web/database/manager)
                  </li>
                  <li>Upload it in the next step</li>
                </ol>
              </div>
            </div>
            <div className="mb-3">
              Odoo.sh only hosts major Odoo versions, intermediate versions (eg: 16.1, 15.2) are not
              supported.
            </div>

            <Alert isLight={true} color="warning" icon="Info">
              During the import process, Odoo.sh will reset the system parameters for web.base.url
              and mail.catchall.domain as well as deactivating the custom mail servers, as the
              platform is managing this on your behalf. Please review these parameters after the
              import if you require to set custom values.
            </Alert>
            <Alert isLight={true} color="danger" icon="Report">
              You are about to replace your current production database! Importing an external
              database can conflict with the original one if it's still hosted elsewhere. To set up
              a test database please import in a staging branch instead to benefit from the
              neutralize system.
            </Alert>
          </ModalBody>
          <ModalFooter>
            <Button
              color="info"
              isOutline
              className="border-0"
              onClick={() => setImportDatabaseState(false)}
            >
              Discard
            </Button>
            <Button
              color="info"
              onClick={() => {
                setImportDatabaseState(false);
                setUploadDatabaseState(true);
              }}
            >
              Next
            </Button>
          </ModalFooter>
        </Modal>

        {/* {Upload Database Modal} */}

        <Modal
          isOpen={uploadDatabaseState || isLoadinguploadFileToS3}
          setIsOpen={setUploadDatabaseState}
          titleId="createBackup"
          isStaticBackdrop={true}
          isScrollable={false}
          isCentered={false}
          size="lg"
          fullScreen={false}
          isAnimation={false}
        >
          <ModalHeader>
            <ModalTitle id="exampleModalLabel">Upload your Database</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <div className="mb-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="repoSelection"
                  id="flexRadioDefault1"
                  value="local_file"
                  onChange={(e) => {
                    formik.handleChange(e);
                  }}
                  checked={formik.values.repoSelection === "local_file"}
                />
                <label className="form-check-label">
                  <strong>Through your local file</strong>
                </label>
              </div>

              {formik.values.repoSelection === "local_file" && (
                <>
                  <div className="mt-3 mb-3">
                    Select the file and ensure you're on a stable internet connection.
                    <div style={{ fontWeight: "bold" }}>Dump file (.zip)</div>
                    <span>
                      <small>(only .zip file will be uploaded)</small>
                    </span>
                  </div>
                  <div className="mb-3" style={{ width: "25em" }}>
                    <input
                      className="form-control form-control-sm"
                      type="file"
                      accept=".zip"
                      capture="environment"
                      onChange={(e) => {
                        handleFileUpload(e);
                      }}
                    />
                  </div>
                  {!isZipFile && (
                    <Alert color="danger" isLight>
                      Please select a .zip file
                    </Alert>
                  )}
                </>
              )}
            </div>
            <div className="mt-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="repoSelection"
                  id="flexRadioDefault2"
                  value="hosted_file"
                  onChange={(e) => {
                    formik.handleChange(e);
                  }}
                  checked={formik.values.repoSelection === "hosted_file"}
                />
                <label className="form-check-label">
                  <strong>Through hosted URL </strong>
                </label>
              </div>

              {formik.values.repoSelection === "hosted_file" && (
                <div className="mb-3 mt-3">
                  <div>Enter URL </div>
                  <input
                    className="form-control form-control-sm"
                    type="text"
                    id="sshUrl"
                    value={formik.values.databaseUrl}
                    onChange={handleUrlChange}
                  />
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="info"
              isOutline
              className="border-0"
              onClick={() => setUploadDatabaseState(false)}
            >
              Discard
            </Button>
            <Button
              color="info"
              icon="Save"
              onClick={handleImport}
              isDisable={
                formik.values.repoSelection === "hosted_file"
                  ? formik.values.databaseUrl === "" || isLoadingImportDatabase
                  : !isZipFile || isLoadinguploadFileToS3
              }
            >
              <span style={{ marginRight: "10px" }}>Import</span>
              {isLoadinguploadFileToS3 ||
                (isLoadingImportDatabase && <Spinner tag="span" color="light" isSmall />)}
            </Button>
          </ModalFooter>
        </Modal>

        {/* {Download Option Modal} */}

        <Modal
          isOpen={downloadOptionsState}
          setIsOpen={setDownloadOptionsState}
          titleId="createBackup"
          isStaticBackdrop={true}
          isScrollable={false}
          isCentered={false}
          size="lg"
          fullScreen={false}
          isAnimation={false}
        >
          <ModalHeader>
            <ModalTitle id="exampleModalLabel">Download a database dump</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <div className="mb-4">
              Downloading a database dump can take a while, depending on the build's size.
              <div className="container mb-3 mt-3">
                <div className="row">
                  <div className="col-md-2" style={{ fontWeight: "bold" }}>
                    Type of dump
                  </div>

                  <div className="col-md-8">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="dumpType"
                        id="flexRadioDefault1"
                        value="neutralized"
                        checked={formik.values.dumpType === "neutralized"}
                        onChange={formik.handleChange}
                      />
                      <label className="form-check-label">
                        <strong>Neutralized database dump for testing/troubleshooting</strong>
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="dumpType"
                        id="flexRadioDefault2"
                        value="exact"
                        checked={formik.values.dumpType === "exact"}
                        onChange={formik.handleChange}
                      />
                      <label className="form-check-label">
                        <strong>Exact database dump</strong>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="container">
                <div className="row">
                  <div className="col-md-2" style={{ fontWeight: "bold" }}>
                    Filestore
                  </div>

                  <div className="col-md-8">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="filestore"
                        id="flexRadioDefault1"
                        value="withoutFilestore"
                        checked={formik.values.filestore === "withoutFilestore"}
                        onChange={formik.handleChange}
                      />
                      <label className="form-check-label">
                        <strong>Without filestore</strong>
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="filestore"
                        id="flexRadioDefault2"
                        value="withFilestore"
                        checked={formik.values.filestore === "withFilestore"}
                        onChange={formik.handleChange}
                      />
                      <label className="form-check-label">
                        <strong>With filestore</strong>
                      </label>
                    </div>

                    <div>
                      <small>
                        The filestore makes the database dump quite larger. It contains all the
                        files and attachments but is often not necessary for testing/troubleshooting
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3"></div>

            <div className="mt-2">
              You will be notified when the database dump is ready for download.
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="info"
              isOutline
              className="border-0"
              onClick={() => setDownloadOptionsState(false)}
            >
              Discard
            </Button>
            <Button
              color="info"
              isDisable={
                formik.values.dumpType === "neutralized" || isLoadingDownloadDatabaseDumpApi
              }
              // onClick={() => handleStartButtonClick(preSignedUrl)}
              onClick={() => handledownloadDatabaseDump()}
            >
              Start
              {isLoadingDownloadDatabaseDumpApi && <Spinner tag="span" color="light" isSmall />}
            </Button>
          </ModalFooter>
        </Modal>

        {/* {Restore Option Modal} */}

        <Modal
          isOpen={restoreOptionsState.isOpen}
          setIsOpen={() => handleRestoreOptionsState(false, null)}
          titleId="restoreBackup"
          isStaticBackdrop={true}
          isScrollable={false}
          isCentered={false}
          size="lg"
          fullScreen={false}
          isAnimation={false}
        >
          <ModalHeader>
            <ModalTitle id="exampleModalLabel">Restore Backup?</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <div className="container">
              <div className="row">
                <div className="col-md-3">Restore Backup into:</div>
                <div className="col-md-8">
                  <FormGroup id="backupComment">
                    <Select
                      id="restoreBranchId"
                      ariaLabel="Default select example"
                      placeholder="select branch"
                      list={branchOptions}
                      onChange={(event: any) => {
                        const selectedValue = event.target.value;
                        formik.setFieldValue("restoreBranchId", selectedValue);
                      }}
                    />
                  </FormGroup>
                </div>
              </div>
            </div>
            <div className="mt-3 mb-3">
              Are you sure you wish to restore the backup from{" "}
              <strong>
                {restoreOptionsState.selectedDate
                  ? new Date(restoreOptionsState.selectedDate).toLocaleString()
                  : ""}
                ?
              </strong>
            </div>
            <Alert isLight={true} color="warning">
              It will replace your current production database and container. A backup will be made
              before the operation.
            </Alert>
          </ModalBody>
          <ModalFooter>
            <Button
              color="info"
              isOutline
              className="border-0"
              onClick={() => setRestoreOptionsState({ isOpen: false, selectedDate: null })}
            >
              Discard
            </Button>
            <Button color="info" icon="Save" onClick={() => handleRestoreBackup()}>
              Restore
            </Button>
          </ModalFooter>
        </Modal>

        {/* {Delete Option Modal} */}

        <Modal
          isOpen={deleteOptionsState}
          setIsOpen={setDeleteOptionsState}
          titleId="deleteBackup"
          isStaticBackdrop={true}
          isScrollable={false}
          isCentered={false}
          size="lg"
          fullScreen={false}
          isAnimation={false}
        >
          <ModalHeader>
            <ModalTitle id="exampleModalLabel">Delete Backup?</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <Alert isLight={true} color="danger">
              <div className="mt-3 mb-3">
                <strong>Are you sure you want to delete the backup ?</strong>
              </div>
            </Alert>
          </ModalBody>
          <ModalFooter>
            <Button color="info" className="border-0" onClick={() => setDeleteOptionsState(false)}>
              Discard
            </Button>
            <Button
              color="danger"
              isOutline
              icon="Save"
              isDisable={promiseLoading}
              onClick={() => handleDeleteBackup()}
            >
              Delete
            </Button>
          </ModalFooter>
        </Modal>
      </>
    </>
  );
};

export default ProjectDetail;
