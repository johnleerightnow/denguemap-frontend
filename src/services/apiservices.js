import axios from "axios";

const baseURL = process.env.REACT_APP_BASE_URL;

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
  getNearestRiskAreaDistance: (formData) => {
    return instance.post("/getNearestRiskAreaDistance", formData);
  },
  userprofile: (token) => {
    return instance.post("/userprofile", token);
  },
  changepassword: (tokennpass) => {
    return instance.post("/changepassword", tokennpass);
  },
};

export default dengueClustersApi;
