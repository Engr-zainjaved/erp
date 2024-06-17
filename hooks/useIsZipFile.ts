import { useState } from "react";

const useIsZipFile = () => {
  const [isZipFile, setIsZipFile] = useState(false);

  const validateFileType = (file: any) => {
    const allowedTypes = ["application/zip", "application/x-zip-compressed"];

    if (file && allowedTypes.includes(file.type)) {
      setIsZipFile(true);
    } else {
      setIsZipFile(false);
    }
  };

  return {
    isZipFile,
    validateFileType,
  };
};

export default useIsZipFile;
