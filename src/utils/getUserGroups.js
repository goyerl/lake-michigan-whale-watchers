import jwtDecode from "jwt-decode";

export function getUserGroups(id_token) {
  if (!id_token) {
    return "";
  }
  const id = jwtDecode(id_token);
  return id["cognito:groups"];
}
