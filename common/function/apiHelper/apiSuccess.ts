import { toast } from "react-toastify";

export const handleApiSuccess = (response: any) => {
  if (response.status >= 200 && response.status < 300) {
    const message =
      response?.message || response?.data?.message || "Success: Request was successful";
    toast.success(message, { autoClose: 5000, theme: "colored" });
  }
};
