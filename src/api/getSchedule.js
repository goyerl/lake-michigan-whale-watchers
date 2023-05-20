import { baseUrl } from "./api-url";

export default async function getSchedule(season) {
  const data = await fetch(`${baseUrl}/schedule`, {
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return data.json();
}
