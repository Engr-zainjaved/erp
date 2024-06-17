"use client";

import type { NextPage } from "next";
import Head from "next/head";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Card, { CardBody, CardHeader } from "../../components/bootstrap/Card";
import Icon from "../../components/icon/Icon";
import Page from "../../layout/Page/Page";
import PageWrapper from "../../layout/PageWrapper/PageWrapper";
import { SubheaderSeparator } from "../../layout/SubHeader/SubHeader";
import { pageLayoutTypesPagesMenu } from "../../menu";
import { useRouter } from "next/router";
import { useEffect, useInsertionEffect, useState } from "react";
import Search from "../../components/Search";
import Spinner from "../../components/bootstrap/Spinner";
import { handleApiResponse } from "../../common/function/apiHelper/apiResponse";
import request from "../../common/lib/axios";
import { useProjectContext } from "../../context/projectContext";
import { getSession, useSession } from "next-auth/react";
import useBackendGitHubLoginApi from "../../hooks/useBackendGitHubLoginApi";

interface User {
  name: string;
  email: string;
  image: string;
  id: string;
}

interface Session {
  user: User;
  expires: string;
  backendToken: string;
  accessToken: string;
}

const Index: NextPage = () => {
  const { SetForDetailProjectId } = useProjectContext();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [projects, setProjects] = useState([]);
  const router = useRouter();
  const [isProjectsLoading, setIsProjectsLoading] = useState(false);
  const { gitHubLoginApi } = useBackendGitHubLoginApi();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      if (
        session &&
        "accessToken" in session &&
        session.accessToken &&
        session.user &&
        session.user.email
      ) {
        let { accessToken, user } = session;
        let { email } = user;

        await gitHubLoginApi(accessToken, email);
        userProject();
      }
    };
    if (!localStorage.getItem("backendToken")) {
      fetchData();
    }
  }, [session]);

  const userProject = () => {
    setIsProjectsLoading(true);

    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/user/project/`;

    request
      .get(apiUrl)
      .then((response) => {
        setProjects(response?.data?.data);
      })
      .catch((error) => {
        handleApiResponse(error);
      })
      .finally(() => {
        setIsProjectsLoading(false);
      });
  };

  useEffect(() => {
    if (localStorage.getItem("backendToken")) {
      userProject();
    }
    const errorMessage = localStorage.getItem("errorMessage");

    if (errorMessage && typeof window !== "undefined") {
      setTimeout(() => {
        toast.error(errorMessage, { autoClose: 5000, theme: "colored" });
      }, 1000);

      localStorage.removeItem("errorMessage");
    }
  }, []);

  return (
    <PageWrapper>
      <Head>
        <title>{pageLayoutTypesPagesMenu?.project?.text}</title>
      </Head>
      <Page>
        <ToastContainer />
        <div className="d-flex align-items-center justify-content-between">
          <div className="h3 fw-bold">Your Projects</div>
          <div className="h3 fw-bold">
            {" "}
            <Search />
          </div>
        </div>

        <hr className="my-4" />

        <div className="row g-4">
          <div className="col-lg-4">
            <Card
              shadow="md"
              borderColor="dark"
              borderSize={1}
              style={{ cursor: "pointer", height: "315px" }}
              onClick={() => {
                router.push("/project/create");
              }}
            >
              <CardBody
                tag="CreateProject"
                className="d-flex align-items-center justify-content-center"
              >
                <div className="d-flex flex-column align-items-center">
                  <Icon icon="Add" size="4x" />
                  <div style={{ fontSize: "20px" }}>Create New</div>
                </div>
              </CardBody>
            </Card>
          </div>

          {projects?.length > 0 &&
            projects.map((project: any, index: any) => (
              <div className="col-lg-4" key={index}>
                <Card shadow="md" borderColor="dark" borderSize={1} stretch={false} hasTab={false}>
                  <CardHeader size="sm" borderSize={1} borderColor="dark">
                    <div
                      className="container row"
                      style={{
                        cursor: "pointer",
                        textDecoration: index === hoveredIndex ? "underline" : "none",
                      }}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      onClick={() => {
                        router.push(`/project/[name]`, `/project/${project?.name}`);
                        localStorage.setItem("projectId", project?.id);
                        SetForDetailProjectId(project?.id);
                      }}
                    >
                      {project.name}
                    </div>
                  </CardHeader>
                  <CardHeader size="sm" borderSize={1} borderColor="dark">
                    <div className="container row">
                      <div className="col-sm-4">License</div>
                      <div className="col-sm-8">Trial</div>
                    </div>
                  </CardHeader>
                  <CardHeader size="sm" borderSize={1} borderColor="dark">
                    <div className="container row">
                      <div className="col-sm-4">Status</div>
                      <div className="col-sm-8">{project.meta.status}</div>
                    </div>
                  </CardHeader>
                  <CardHeader size="sm" borderSize={1} borderColor="dark">
                    <div className="container row">
                      <div className="col-sm-4">Version</div>
                      <div className="col-sm-8">{project.meta.odoo_version}</div>
                    </div>
                  </CardHeader>
                  <CardHeader size="sm" borderSize={1} borderColor="dark">
                    <div className="container row">
                      <div className="col-sm-4">Location</div>
                      <div className="col-sm-8">{project.meta.hosting_location}</div>
                    </div>
                  </CardHeader>
                  <CardBody
                    tag="CreateProject"
                    className="d-flex align-items-center justify-content-between"
                  >
                    <div className="d-flex align-items-center justify-content-center">
                      {/* Assuming you want to display some information here */}
                      <Icon icon="Notifications" size="2x" />
                    </div>
                    {/* Additional components for other icons */}
                    <SubheaderSeparator />
                    <Icon icon="Settings" size="2x" />
                    <SubheaderSeparator />
                    <Icon icon="CustomGithub" size="2x" />
                    <SubheaderSeparator />
                    <div className="d-flex align-items-center">
                      Open
                      <Icon icon="ArrowForwardIos" />
                    </div>
                  </CardBody>
                </Card>
              </div>
            ))}
          {isProjectsLoading && (
            <div className="d-flex align-items-center justify-content-center">
              <Spinner tag="span" color="dark" size={"3rem"} />
            </div>
          )}
        </div>
      </Page>
    </PageWrapper>
  );
};

export default Index;
