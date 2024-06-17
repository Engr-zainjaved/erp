import type { NextPage } from "next";
import { GetStaticProps } from "next";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import PageWrapper from "../layout/PageWrapper/PageWrapper";
import { pageLayoutTypesPagesMenu } from "../menu";
import Humans from "../assets/img/scene8.png";
import Page from "../layout/Page/Page";
import router from "next/router";
import { useSession, signIn, signOut, getCsrfToken } from "next-auth/react";
import { useEffect } from "react";
import { handleApiError } from "../common/function/apiHelper/apiHelper";
import Login from "./auth-pages/login";

const Index: NextPage = () => {
  const { data: session, status, update } = useSession();

  return (
    <PageWrapper>
      <Head>
        <title>{pageLayoutTypesPagesMenu.blank.text}</title>
      </Head>
      <Page>
        {session && (
          <>
            <div
              className="col-12 d-flex justify-content-center"
              style={{ fontSize: "calc(1em + 1vw)", cursor: "pointer" }}
              onClick={() => {
                router.push("/project");
              }}
            >
              go to Projects
            </div>
            <div
              className="col-12 d-flex justify-content-center"
              style={{ fontSize: "calc(1em + 1vw)", cursor: "pointer" }}
              onClick={() => {
                localStorage.clear();
                signOut({ callbackUrl: "/" });
                if (typeof window !== "undefined") {
                  window.history.replaceState({}, document.title, "/");
                }
              }}
            >
              Sign Out
            </div>
          </>
        )}

        {!session && <Login />}
      </Page>
    </PageWrapper>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    // @ts-ignore
    ...(await serverSideTranslations(locale, ["common", "menu"])),
  },
});

export default Index;
