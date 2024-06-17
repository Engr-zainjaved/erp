import classNames from "classnames";
import { useFormik } from "formik";
import type { NextPage } from "next";
import { GetStaticProps } from "next";
import { signIn } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { FC, useCallback, useContext, useState } from "react";
import USERS, { getUserDataWithUsername } from "../../../common/data/userDummyData";
import Button from "../../../components/bootstrap/Button";
import Card, { CardBody } from "../../../components/bootstrap/Card";
import AuthContext from "../../../context/authContext";
import useDarkMode from "../../../hooks/useDarkMode";
import Page from "../../../layout/Page/Page";
import PageWrapper from "../../../layout/PageWrapper/PageWrapper";
import authContext from "../../../context/authContext";

interface ILoginHeaderProps {
  isNewUser?: boolean;
}
const LoginHeader: FC<ILoginHeaderProps> = ({ isNewUser }) => {
  if (isNewUser) {
    return (
      <>
        <div className="text-center h1 fw-bold mt-5">Create Account,</div>
        <div className="text-center h4 text-muted mb-5">Sign up to get started!</div>
      </>
    );
  }
  return (
    <>
      <div className="text-center h1 fw-bold mt-5">Welcome,</div>
      <div className="text-center h4 text-muted mb-5">Sign in to continue!</div>
    </>
  );
};

interface ILoginProps {
  isSignUp?: boolean;
}
const Login: NextPage<ILoginProps> = ({ isSignUp }) => {
  const router = useRouter();

  const { darkModeStatus } = useDarkMode();

  const [signInPassword, setSignInPassword] = useState<boolean>(false);
  const [singUpStatus, setSingUpStatus] = useState<boolean>(!!isSignUp);

  const handleOnClick = useCallback(() => router.push("/project"), [router]);
  const usernameCheck = (username: string) => {
    return !!getUserDataWithUsername(username);
  };

  const passwordCheck = (username: string, password: string) => {
    return getUserDataWithUsername(username).password === password;
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      loginUsername: USERS.JOHN.username,
      loginPassword: USERS.JOHN.password,
    },
    validate: (values) => {
      const errors: { loginUsername?: string; loginPassword?: string } = {};

      if (!values.loginUsername) {
        errors.loginUsername = "Required";
      }

      if (!values.loginPassword) {
        errors.loginPassword = "Required";
      }

      return errors;
    },
    validateOnChange: false,
    onSubmit: (values) => {
      if (usernameCheck(values.loginUsername)) {
        if (passwordCheck(values.loginUsername, values.loginPassword)) {
          handleOnClick();
        } else {
          formik.setFieldError("loginPassword", "Username and password do not match.");
        }
      }
    },
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleContinue = () => {
    setIsLoading(true);
    setTimeout(() => {
      if (
        !Object.keys(USERS).find(
          (f) => USERS[f].username.toString() === formik.values.loginUsername
        )
      ) {
        formik.setFieldError("loginUsername", "No such user found in the system.");
      } else {
        setSignInPassword(true);
      }
      setIsLoading(false);
    }, 1000);
  };

  // const isProduction = process.env.NODE_ENV === "production";
  // const callbackUrl = isProduction
  //   ? `${process.env.NEXT_PUBLIC_PRODUCTION_CALLBACK_URL}`
  //   : `${process.env.NEXT_PUBLIC_LOCAL_CALLBACK_URL}`;

  return (
    <PageWrapper isProtected={false}>
      <Head>
        <title>{singUpStatus ? "Sign Up" : "Login"}</title>
      </Head>
      <Page className="p-0">
        <div className="row h-100 align-items-center justify-content-center">
          <div className="col-xl-4 col-lg-6 col-md-8 shadow-3d-container">
            <Card className="shad2ow-3d-dardk" data-tour="login-page">
              <CardBody>
                <LoginHeader isNewUser={singUpStatus} />

                <form className="row g-4">
                  {!signInPassword && (
                    <>
                      <div className="col-12 mt-3">
                        <Button
                          isOutline
                          color={darkModeStatus ? "light" : "dark"}
                          className={classNames("w-100 py-3", {
                            "border-light": !darkModeStatus,
                            "border-dark": darkModeStatus,
                          })}
                          icon="CustomGithub"
                          onClick={() => signIn("github", { callbackUrl: "/project" })}
                        >
                          Continue with GitHub
                        </Button>
                      </div>
                    </>
                  )}
                </form>
              </CardBody>
            </Card>
            <div className="text-center">
              <Link
                href="/"
                className={classNames("text-decoration-none me-3", {
                  "link-light": singUpStatus,
                  "link-dark": !singUpStatus,
                })}
              >
                Privacy policy
              </Link>
              <Link
                href="/"
                className={classNames("link-light text-decoration-none", {
                  "link-light": singUpStatus,
                  "link-dark": !singUpStatus,
                })}
              >
                Terms of use
              </Link>
            </div>
          </div>
        </div>
      </Page>
    </PageWrapper>
  );
};
Login.propTypes = {
  isSignUp: PropTypes.bool,
};
Login.defaultProps = {
  isSignUp: false,
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    // @ts-ignore
    ...(await serverSideTranslations(locale, ["common", "menu"])),
  },
});

export default Login;
