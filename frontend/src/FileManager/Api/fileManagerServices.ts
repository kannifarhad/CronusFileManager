import createAxiosInstance from "./axiosInstance";

const axiosInstance = createAxiosInstance();

export const getFoldersList = async ({ path }: { path: string }) => {
  return axiosInstance
    .post("folder", { path })
    .then((response) => response.data);
};
