import axios from "axios";

const baseURL =
  "http://ec2-18-181-96-189.ap-northeast-1.compute.amazonaws.com:5001/api/v1";

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
};

export default dengueClustersApi;
