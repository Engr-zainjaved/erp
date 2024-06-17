import { useState, useEffect } from "react";

const useUpdateStatus = (apiData: any, websocketData: any) => {
  const [updatedApiData, setUpdatedApiData] = useState(apiData);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);

  useEffect(() => {
    try {
      setSelectedBranchId(localStorage.getItem("branchId"));
    } catch {
      console.error("error in selected branchId from local storage");
    }

    if (updatedApiData && websocketData) {
      if (
        websocketData.type === "branch_updated" &&
        selectedBranchId == websocketData.data.branch.id
      ) {
        const newItem = websocketData.data.tracking;
        const newApiData = [newItem, ...updatedApiData];
        setUpdatedApiData(newApiData);
      } else if (
        websocketData.type === "build_event" &&
        selectedBranchId == websocketData.branch_id
      ) {
        let websocketBuildId = websocketData.build.id;
        let websocketBuildStatus = websocketData.build.status;
        let websocketBuildUrl = websocketData.build.url;
        let websocketBuildIsActive = websocketData.build.is_active;

        // Update status if hash matches
        const updatedData = updatedApiData.map((item: any) => {
          if (item.build !== null && item?.build?.id === websocketBuildId) {
            return {
              ...item,
              build: {
                id: websocketBuildId,
                status: websocketBuildStatus,
                url: websocketBuildUrl,
                is_active: websocketBuildIsActive,
              },
            };
          }
          return item;
        });

        setUpdatedApiData(updatedData);
      }
    } else {
      setUpdatedApiData(apiData);
    }
  }, [apiData, websocketData]);

  return updatedApiData;
};

export { useUpdateStatus };
