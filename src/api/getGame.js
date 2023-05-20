import { baseUrl } from "./api-url";

export default async function getGameDetails(gameDate) {
  const data = await fetch(`${baseUrl}/schedule/${gameDate}`, {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return data.json();
}
