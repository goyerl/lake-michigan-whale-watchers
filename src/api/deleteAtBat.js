import { baseUrl } from "./api-url";

export async function deleteAtBat(atBat) {
  const response = await fetch(
    `${baseUrl}/at-bats/${atBat.gameDate}/delete/${atBat.id}`,
    {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response;
}
