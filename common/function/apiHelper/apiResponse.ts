import { toast } from "react-toastify";

export const handleApiResponse = (response: any) => {
  let message = "Success: Request was successful";
  let apiStatus;

  if (response == undefined) {
    toast.error("Server not live", { autoClose: 5000, theme: "colored" });
  }

  if (response?.status !== undefined) {
    apiStatus = response.status;
  } else if (response?.response && response.response.status !== undefined) {
    apiStatus = response.response.status;
  } else {
    apiStatus = "defaultFallbackValue";
  }

  if (apiStatus >= 400 && apiStatus < 500) {
    if (
      response.response &&
      response.response.data &&
      response.response.data.errors &&
      response.response.data.errors[0]
    ) {
      message = response.response.data.errors[0];
      toast.error(message, { autoClose: 5000, theme: "colored" });
    } else {
      message = "Unable to get response message from backend";
      toast.error(message, { autoClose: 5000, theme: "colored" });
    }
  } else if (apiStatus >= 500 && apiStatus < 600) {
    if (
      response.response &&
      response.response.data &&
      response.response.data.errors &&
      response.response.data.errors[0]
    ) {
      message = `Server Error: ${apiStatus} - ${response.response.data.errors[0]}`;
      toast.error(message, { autoClose: 5000, theme: "colored" });
    } else {
      message = "Internal Server Error";
      toast.error(message, { autoClose: 5000, theme: "colored" });
    }
  } else if (response?.code === "ERR_NETWORK") {
    message = "Network Error";
    toast.warning(message, { autoClose: 5000, theme: "colored" });
  } else {
    message = "An unexpected error occurred or Backend Api failed";
    toast.error(message, { autoClose: 5000, theme: "colored" });
  }

  return message;
};
