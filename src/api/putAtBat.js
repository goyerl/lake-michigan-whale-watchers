import { baseUrl } from "./api-url";

export default async function putAtBat(
  gameDate,
  msTime,
  atBatResult,
  runScored,
  rbi,
  inning,
  username,
  season
) {
  const data = {
    gameDate,
    gameMsTime: msTime,
    atBatResult,
    runScored,
    rbi,
    inning,
    username,
    season,
  };
  const response = await fetch(`${baseUrl}/at-bats/put`, {
    method: "PUT",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response;
}
