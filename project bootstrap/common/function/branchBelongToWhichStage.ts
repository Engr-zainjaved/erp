export function findEnvironment(branchId: any, data: any) {
  for (const environment in data) {
    if (data.hasOwnProperty(environment)) {
      const branches = data[environment].branches;
      for (const branch of branches) {
        if (branch.id == branchId) {
          return environment;
        }
      }
    }
  }
  return null;
}
