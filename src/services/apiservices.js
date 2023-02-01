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
  userprofile: (token) => instance.post("/userprofile", token),
  updateprofile: (token, profileinfo) =>
    instance.post("/updateprofile", { token, profileinfo }),
  changepassword: (tokennpass) => instance.post("/changepassword", tokennpass),
  contactform: (formValues) => instance.post("contactform", formValues),
};

export default dengueClustersApi;
