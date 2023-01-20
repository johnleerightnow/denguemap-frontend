import axios from "axios";

const baseURL = "http://localhost:5001/api/v1";

const instance = axios.create({ baseURL: baseURL, timeout: 10000 });

const dengueClustersApi = {
  getClustersFromApi: () => {
    return instance.post("/getclustersfromapi");
  },
  getClustersFromDB: () => {
    return instance.post("/getclustersfromDB");
  },
  signup: (formData) => {
    return instance.post("/signup", formData);
  },
  checkemail: (formData) => {
    return instance.post("/checkemail", formData);
  },
  signin: (formData) => {
    return instance.post("/signin", formData);
  },
};

export default dengueClustersApi;
