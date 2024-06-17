import { toast } from "react-toastify";

export const handleApiError = (error: any) => {
  console.error("API Error:", error);

  const errorMessage = error?.errors[0] || "An unexpected error occurred.";

  //   toast.error(errorMessage);

  toast.error(errorMessage, {
    autoClose: false,
    theme: "colored",
  });

  return errorMessage;
};
