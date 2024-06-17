import { useRouter } from "next/router";
import Card, {
  CardBody,
  CardHeader,
  CardLabel,
  CardSubTitle,
  CardTitle,
} from "../../../../components/bootstrap/Card";
import { useEffect, useState } from "react";

import Link from "next/link";
import { useProjectContext } from "../../../../context/projectContext";
import Page from "../../../../layout/Page/Page";
import Spinner from "../../../../components/bootstrap/Spinner";
import SubHeader, { SubHeaderLeft, SubHeaderRight } from "../../../../layout/SubHeader/SubHeader";
import Head from "next/head";
import Icon from "../../../../components/icon/Icon";
import Input from "../../../../components/bootstrap/forms/Input";
import { useFormik } from "formik";
import PageWrapper from "../../../../layout/PageWrapper/PageWrapper";
import Bar from "../../../../components/buildsPage/Bar";
import HeadingBuildCard from "../../../../components/buildsPage/HeadingBuildCard";
import DetailBuildCard from "../../../../components/buildsPage/DetailBuildCard";

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

type ProjectItem = PlatformEvent | GitHubEvent;

const ProjectBuilds = () => {
  const formik = useFormik({
    initialValues: {
      searchInput: "",
    },
    onSubmit: () => {},
  });

  const { projectData, branchName, projectMessage } = useProjectContext();
  const router = useRouter();

  const calculateTimeAgo = (dateCreated: string | undefined): string => {
    if (!dateCreated) {
      return "No date provided";
    }
    const dateCreatedTime: any = new Date(dateCreated);
    const currentTime: any = new Date();
    const timeDifference = currentTime - dateCreatedTime;
    const hoursAgo = Math.floor(timeDifference / (1000 * 60 * 60));

    if (hoursAgo < 1) {
      return "Less than an hour ago";
    } else if (hoursAgo < 24) {
      return `${hoursAgo} ${hoursAgo === 1 ? "hour" : "hours"} ago`;
    } else {
      const daysAgo = Math.floor(hoursAgo / 24);
      return `${daysAgo} ${daysAgo === 1 ? "day" : "days"} ago`;
    }
  };

  const sortedProjectData: ProjectItem[] = projectData
    ? projectData.slice().sort((a: any, b: any) => {
        const dateA: Date = new Date(a.date_created);
        const dateB: Date = new Date(b.date_created);
        return dateB.getTime() - dateA.getTime();
      })
    : [];

  const PlatformProjectCard = ({ item }: { item: any }) => {
    return (
      <Card shadow="sm" className="mb-3">
        <CardHeader>
          <CardLabel>
            <CardTitle>
              <img
                src={item.committer ? item.committer.avatar : ""}
                alt={item.committer ? item.committer.username : ""}
                className="mr-2"
                style={{
                  width: "30px",
                  cursor: "pointer",
                  marginRight: "4px",
                }}
              />
              {item.committer ? item.committer.username : ""}{" "}
              <small>{calculateTimeAgo(item.date_created)}</small>
            </CardTitle>
            <CardSubTitle>{item.event_description}</CardSubTitle>
          </CardLabel>
        </CardHeader>
        <CardBody>{item.event_verbose}</CardBody>
      </Card>
    );
  };

  const GitHubProjectCard = ({ item }: { item: any }) => {
    return (
      <Card shadow="sm" className="mb-3">
        <CardHeader>
          <CardLabel>
            <CardTitle>
              <img
                src={item.committer.avatar}
                alt={item.committer.username}
                className="mr-2"
                style={{
                  width: "30px",
                  cursor: "pointer",
                }}
              />
              {item.committer.name} <small>{calculateTimeAgo(item.date_created)}</small>
            </CardTitle>
          </CardLabel>
        </CardHeader>
        <CardBody>
          <Card shadow="sm" className="mb-0">
            <CardBody>
              <a
                href={item.commit?.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <div className="d-flex justify-content-between">
                  <div>{item.commit?.title}</div>
                  <div>{item.commit?.url.slice(-7)}</div>
                </div>
              </a>
            </CardBody>
          </Card>
        </CardBody>
      </Card>
    );
  };

  return (
    <PageWrapper>
      <Head>
        <title>Odoo - Builds</title>
      </Head>
      <SubHeader>
        <SubHeaderLeft>
          <label className="border-0 bg-transparent cursor-pointer me-0" htmlFor="searchInput">
            <Icon icon="Search" size="2x" color="primary" />
          </label>
          <Input
            id="searchInput"
            type="search"
            className="border-0 shadow-none bg-transparent"
            placeholder="Search..."
            onChange={formik.handleChange}
            value={formik.values.searchInput}
          />
        </SubHeaderLeft>
      </SubHeader>
      <Page>
        <Bar heading="Production" icon="Save" />
        <div className="d-flex mt-3">
          <HeadingBuildCard
            icon="Save"
            heading="Prod"
            firstButton="GitHub"
            secondButton="Connect"
          />

          <div style={{ marginRight: "5px" }}>
            <DetailBuildCard color="success" />
          </div>

          <div style={{ marginRight: "5px" }}>
            <DetailBuildCard color="success" />
          </div>

          <div>
            <DetailBuildCard color="success" />
          </div>
        </div>

        <Bar heading="Staging" icon="Save" />
        <div className="d-flex mt-3">
          <HeadingBuildCard icon="Save" heading="Dev" firstButton="GitHub" secondButton="Unmute" />

          <div style={{ marginRight: "5px" }}>
            <DetailBuildCard color="danger" message="Odoo build timed-out" />
          </div>
        </div>
        <Bar heading="Development" icon="Save" />
        <div className="d-flex mt-3">
          <HeadingBuildCard
            icon="Save"
            heading="Prod"
            firstButton="GitHub"
            secondButton="Connect"
          />

          <div style={{ marginRight: "5px" }}>
            <DetailBuildCard color="success" />
          </div>

          <div style={{ marginRight: "5px" }}>
            <DetailBuildCard color="success" />
          </div>
        </div>
      </Page>
    </PageWrapper>
  );
};

export default ProjectBuilds;
