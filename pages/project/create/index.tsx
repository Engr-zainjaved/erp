import { useFormik } from "formik";
import type { NextPage } from "next";
import { GetStaticProps } from "next";
import { getSession, useSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Alert from "../../../components/bootstrap/Alert";
import Card, { CardBody } from "../../../components/bootstrap/Card";
import Checks, { ChecksGroup } from "../../../components/bootstrap/forms/Checks";
import FormGroup from "../../../components/bootstrap/forms/FormGroup";
import Input from "../../../components/bootstrap/forms/Input";
import Select from "../../../components/bootstrap/forms/Select";
import Page from "../../../layout/Page/Page";
import PageWrapper from "../../../layout/PageWrapper/PageWrapper";
import { pageLayoutTypesPagesMenu } from "../../../menu";
import { handleApiError } from "../../../common/function/apiHelper/apiHelper";
import Spinner from "../../../components/bootstrap/Spinner";
import { handleApiResponse } from "../../../common/function/apiHelper/apiResponse";
import axios from "axios";
import request from "../../../common/lib/axios";
import { handleApiSuccess } from "../../../common/function/apiHelper/apiSuccess";

const Index: NextPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [selectedOption, setSelectedOption] = useState("new");
  const [gitHubauthToken, setGitHubAuthToken] = useState<string | null>(null);
  const [gitHubRepositories, setGitHubRepositories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("backendToken");
    setGitHubAuthToken(storedToken);
  }, []);

  const handleRadioChange = async (event: any) => {
    setLoading(true);
    setSelectedOption(event.target.value);
    flexRadios.handleChange(event);

    if (selectedOption === "new") {
      const apiUrl = `/user/repository/`;
      const response = await request.get(apiUrl);
      const responseData = response.data.data;
      setGitHubRepositories(responseData);
      setLoading(false);
    }
  };

  const selectOptions = gitHubRepositories.map((repo: any) => ({
    value: repo.id,
    text: repo.name,
  }));

  const flexRadios = useFormik({
    initialValues: {
      repoSelection: "new",
      flexRadioDisabled: "third",
    },
    onSubmit: () => {},
  });

  const formik = useFormik({
    initialValues: {
      repoSelection: "new",
      newRepoName: "",
      existingRepoName: "",
      odooVersion: 17.0,
      subscriptionCode: "",
      hostingLocation: "Americas",
    },
    onSubmit: (values) => {
      setLoadingSubmit(true);

      let payload;
      if (values.repoSelection === "new") {
        payload = {
          existing_repo: false,
          repository_name: values.newRepoName,
          odoo_version: values.odooVersion.toString(),
          hosting_location: values.hostingLocation.toLowerCase(),
        };
      } else {
        payload = {
          existing_repo: true,
          github_repo_name: values.existingRepoName,
          odoo_version: values.odooVersion.toString(),
          hosting_location: values.hostingLocation.toLowerCase(),
        };
      }

      const headers = {
        Authorization: `Bearer ${gitHubauthToken}`,
        "Content-Type": "application/json",
      };

      request
        .post(`${process.env.NEXT_PUBLIC_BASE_URL}/user/project/`, payload, {
          headers,
        })
        .then((response) => {
          handleApiSuccess(response);
          formik.resetForm();
          router.push("/project");
        })
        .catch((error) => {
          handleApiResponse(error);
        })
        .finally(() => {
          setLoadingSubmit(false);
        });
    },
  });

  return (
    <PageWrapper>
      <Head>
        <title>{pageLayoutTypesPagesMenu.CreateProject.text}</title>
      </Head>
      <Page>
        <Card shadow="md" borderColor={null} stretch={true} hasTab={false}>
          <CardBody tag="CreateProject">
            <form onSubmit={formik.handleSubmit}>
              <div
                className="col-12 d-flex justify-content-center "
                style={{ fontSize: "calc(3rem + 3vw)" }}
              >
                <h1>Deploy Your Platform </h1>
              </div>
              <Alert isLight color="success">
                <div className="col-12 d-flex align-items-center justify-content-center">
                  Each odoo.sh project is linked to a GitHub repository where your modules will be
                  stored. Please create or select the repository for this project linked to your
                  GitHub account.
                </div>
              </Alert>
              <div className="container">
                <div className="row">
                  <div className="col-sm-4">
                    <div className="card">
                      <div className="card-body" style={{ height: "113px" }}>
                        Github Repository:
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-8">
                    <div className="card">
                      <div className="card-body">
                        <ChecksGroup isInline={true}>
                          <Checks
                            type="radio"
                            name="repoSelection"
                            id="flexRadioDefault1"
                            label="New repository"
                            value="new"
                            onChange={(e) => {
                              formik.handleChange(e);
                              handleRadioChange(e);
                            }}
                            checked={flexRadios.values.repoSelection}
                          />

                          <Checks
                            type="radio"
                            name="repoSelection"
                            id="flexRadioDefault2"
                            label="Existing repository"
                            value="existing"
                            onChange={(e) => {
                              formik.handleChange(e);
                              handleRadioChange(e);
                            }}
                            checked={flexRadios.values.repoSelection}
                          />
                        </ChecksGroup>

                        <FormGroup>
                          {selectedOption === "new" ? (
                            <Input
                              id="newRepoName"
                              placeholder="new repository"
                              aria-label="newRepoName"
                              autoComplete="newRepoName"
                              ariaDescribedby="addon1"
                              onChange={formik.handleChange}
                              value={formik.values.newRepoName}
                            />
                          ) : (
                            <div className="d-none"></div>
                          )}

                          {selectedOption === "existing" ? (
                            <>
                              {loading ? (
                                <Spinner color="dark" size="sm" />
                              ) : (
                                <Select
                                  id="existingRepoName"
                                  ariaLabel="Default select example"
                                  placeholder="select existing repository"
                                  defaultValue=""
                                  list={selectOptions}
                                  onChange={(event: any) => {
                                    const selectedValue = event.target.value;
                                    formik.setFieldValue("existingRepoName", selectedValue);
                                  }}
                                />
                              )}
                            </>
                          ) : (
                            <div className="d-none"></div>
                          )}
                        </FormGroup>

                        <div className="d-flex align-items-cente justify-content-center">
                          <a href="#">
                            <span>Can't see your organization or repository?</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="container">
                <div className="row">
                  <div className="col-sm-4">
                    <div className="card">
                      <div className="card-body" style={{ height: "73px" }}>
                        Odoo Version:
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-8">
                    <div className="card">
                      <div className="card-body">
                        <Select
                          id="odooVersion"
                          ariaLabel="Default select example"
                          placeholder=""
                          list={[
                            { value: 17.0, text: "17.0" },
                            { value: 16.0, text: "16.0" },
                            { value: 15.0, text: "15.0" },
                          ]}
                          onChange={(event: any) => {
                            const selectedValue = event.target.value;
                            formik.setFieldValue("odooVersion", selectedValue);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="container">
                <div className="row">
                  <div className="col-sm-4">
                    <div className="card">
                      <div className="card-body" style={{ height: "95px" }}>
                        Subscription Code:
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-8">
                    <div className="card">
                      <div className="card-body">
                        <Input
                          id="subscriptionCode"
                          placeholder="enter subscription code"
                          aria-label="subscriptionCode"
                          autoComplete="subscriptionCode"
                          ariaDescribedby="addon1"
                          onChange={formik.handleChange}
                          value={formik.values.subscriptionCode}
                        />

                        <div className="d-flex align-items-cente justify-content-center">
                          <a href="#">
                            <span>Don't have a subscription code?</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="container">
                <div className="row">
                  <div className="col-sm-4">
                    <div className="card">
                      <div className="card-body" style={{ height: "73px" }}>
                        Hosting Location:
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-8">
                    <div className="card">
                      <div className="card-body">
                        <Select
                          id="hostingLocation"
                          ariaLabel="Default select example"
                          placeholder=""
                          list={[
                            { value: "Americas", text: "Americas" },
                            {
                              value: "Europe - Africa",
                              text: "Europe - Africa",
                            },
                            {
                              value: "Middle East - Southern Asia",
                              text: "Middle East - Southern Asia",
                            },
                            { value: "Other Asia", text: "Other Asia" },
                            { value: "Oceania", text: "Oceania" },
                          ]}
                          onChange={(event: any) => {
                            const selectedValue = event.target.value;
                            formik.setFieldValue("hostingLocation", selectedValue);
                          }}
                        />
                      </div>
                    </div>
                    <button
                      style={{
                        marginTop: "10px",
                        width: "100%",
                        backgroundColor: "#46bcaa",
                        border: "none",
                        fontSize: "20px",
                        fontWeight: 500,
                        borderRadius: "10px",
                        cursor: loadingSubmit ? "not-allowed" : "pointer",
                        transition: "background-color 0.3s ease",
                      }}
                      type="submit"
                      disabled={loadingSubmit}
                    >
                      {loadingSubmit ? <Spinner color="dark" size="sm" /> : "Deploy"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </CardBody>
        </Card>
      </Page>
      <ToastContainer />
    </PageWrapper>
  );
};

export default Index;
