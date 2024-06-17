import { useState } from "react";
import axios from "axios";
import { handleApiResponse } from "../common/function/apiHelper/apiResponse";
import { signOut } from "next-auth/react";

const useBackendGitHubLoginApi = () => {
  const [isLoadingBackendGitHubLoginApi, setIsLoadingBackendGitHubLoginApi] = useState(false);

  const gitHubLoginApi = (access_token: any, email: any) => {
    setIsLoadingBackendGitHubLoginApi(true);

    const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/accounts/github/login/`;
    const requestBody = {
      access_token: access_token,
      email: email,
    };

    return new Promise((resolve, reject) => {
      axios
        .post(apiUrl, requestBody)
        .then((response) => {
          localStorage.setItem("backendToken", response?.data?.data?.access);
          resolve(response);
        })
        .catch((error) => {
          console.error("Login Api error: ", error);
          handleApiResponse(error);
          signOut({ callbackUrl: "/" });
          return Promise.reject(error.response);
        })
        .finally(() => {
          setIsLoadingBackendGitHubLoginApi(false);
        });
    });
  };

  return {
    gitHubLoginApi,
    isLoadingBackendGitHubLoginApi,
  };
};

export default useBackendGitHubLoginApi;
