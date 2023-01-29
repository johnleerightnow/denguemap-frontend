import Cookies from "universal-cookie";

export const authenticate = () => {
  const cookies = new Cookies();
  const token = cookies.get("token");
  // console.log("authenticate - token", token);
  if (!token || token === "undefined" || token === "null") {
    return false;
  }
  return true;
};
