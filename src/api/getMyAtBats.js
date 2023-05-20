import { baseUrl } from "./api-url";

export default async function getMyAtBats(gameDate, username) {
  const data = await fetch(`${baseUrl}/at-bats/${gameDate}/${username}`, {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return data.json();
}
