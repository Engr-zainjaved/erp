import { toast } from "react-toastify";

export const handleWebSocketResponse = (response: any) => {
  const successTypes = [
    "branch_added",
    "branch_deleted",
    "branch_updated",
    "build_succeed",
    "import_succeed",
    "restore_succeed",
    "backup_succeed",
    "build_event",
  ];

  const failTypes = [
    "import_failed",
    "restore_failed",
    "build_failed",
    "backup_failed",
    "build_dropped",
  ];

  if (successTypes.includes(response.type)) {
    toast.success(response.message, { autoClose: 5000, theme: "colored" });
  }

  if (failTypes.includes(response.type)) {
    toast.error(response.message, { autoClose: 5000, theme: "colored" });
  }
};
