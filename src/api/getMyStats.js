import { baseUrl } from "./api-url";

export default async function getMyStats(username) {
  const data = await fetch(`${baseUrl}/at-bats/stats/${username}`, {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return data.json();
}
