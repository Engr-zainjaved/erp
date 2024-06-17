import axios, { AxiosResponse, AxiosInstance } from "axios";
import { handleApiResponse } from "../function/apiHelper/apiResponse";
import { signOut } from "next-auth/react";

const createRequestInstance = () => {
  let instance = axios.create({});

  instance.interceptors.request.use(async (config: any) => {
    var jwtTokenSession = localStorage.getItem("backendToken");
    if (jwtTokenSession) {
      config.headers.Authorization = jwtTokenSession ? `Bearer ${jwtTokenSession}` : "";
      config.baseURL = process.env.NEXT_PUBLIC_BASE_URL;
    }

    return config;
  });

  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error: any) => {
      console.error("API Error: ", error);
      handleApiResponse(error);
      if (error.response && [401, 403, 399].includes(error.response.status)) {
        signOut({ callbackUrl: "/" });
      }
      return Promise.reject(error.response);
    }
  );

  return instance;
};

const request: AxiosInstance = createRequestInstance();

export default request;
