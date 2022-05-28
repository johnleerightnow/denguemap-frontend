import axios from "axios";
import qs from "qs";

const baseURL = "https://dengueheatmapbackend.herokuapp.com/api/v1";

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 10000, // 5seconds
});

const dengueClustersAPI = {
  getDengueClusters: () => {
    return axiosInstance.get("/getclustersfromapi");
  },

  login: (email, password) => {
    return axiosInstance.post(
      "/users/login",
      qs.stringify({
        email: email,
        password: password,
      })
    );
  },
  //   {
  //     email: john@gmail.com,
  //     password: password1,
  //   }
  //   email=john@gmail.com&password=password1

  sendRegistrationForm: (formInputs) => {
    return axiosInstance.post("/users/register", qs.stringify(formInputs));
  },

  updateUserProfile: (formInputs) => {
    return axiosInstance.post("/users/profile", qs.stringify(formInputs));
  },
};

export default dengueClustersAPI;
