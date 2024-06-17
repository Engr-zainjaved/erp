export const calculateTimeAgoUTC = (dateCreated: string | undefined): string => {
  if (!dateCreated) {
    return "No date provided";
  }

  // Parse the date in UTC
  const utcDateCreated = new Date(dateCreated + "Z");

  // Get current time in UTC
  const utcNow = new Date().getTime(); // Get milliseconds since epoch

  // Calculate difference in milliseconds
  const timeDifference = utcNow - utcDateCreated.getTime();

  const hoursAgo = Math.floor(timeDifference / (1000 * 60 * 60));

  if (hoursAgo < 1) {
    return "Less than an hour ago";
  } else if (hoursAgo < 24) {
    return `${hoursAgo} ${hoursAgo === 1 ? "hour" : "hours"} ago`;
  } else {
    const daysAgo = Math.floor(hoursAgo / 24);
    return `${daysAgo} ${daysAgo === 1 ? "day" : "days"} ago`;
  }
};

export function updateAllBranches(branchIdToUpdate: any, buildObject: any, currentBranches: any) {
  const updatedBranches = { ...currentBranches };

  for (const stageKey in updatedBranches) {
    if (updatedBranches.hasOwnProperty(stageKey)) {
      const stage = updatedBranches[stageKey];
      if (stage && stage.branches) {
        stage.branches.forEach((branch: any, index: any) => {
          if (branch.id === branchIdToUpdate) {
            updatedBranches[stageKey].branches[index].build = buildObject;
          }
        });
      }
    }
  }

  return updatedBranches;
}

export function isBuildActive(arr: any) {
  if (arr.length === 0) {
    return false;
  }

  if (arr[0].build.status == "success") {
    return true;
  }

  if (
    arr[0].build.status == "in_progress" &&
    arr.length > 1 &&
    arr[1].build?.status === "success"
  ) {
    return true;
  }

  return false;
}

export function updateStatus(apiData: any, websocketData: any, selectedBranchId: string) {
  const updatedData = apiData;

  if (updatedData && websocketData) {
    if (
      websocketData.type === "branch_updated" &&
      selectedBranchId == websocketData.data.branch.id
    ) {
      updatedData.unshift(websocketData.data.tracking);
      return updatedData;
    } else if (
      (websocketData.type === "build_event" ||
        websocketData.type === "build_failed" ||
        websocketData.type === "build_dropped" ||
        websocketData.type === "build_succeed") &&
      selectedBranchId == websocketData.branch_id
    ) {
      const buildObject = websocketData.build;

      const updatedData = apiData.map((item: any) => {
        if (item.build !== null && item?.build?.id === websocketData.build.id) {
          return {
            ...item,
            build: buildObject,
          };
        }
        return item;
      });
      return updatedData;
    }
  }

  return updatedData;
}
