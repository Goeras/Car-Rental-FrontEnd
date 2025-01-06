const API_BASE_URL_LOGIN = "http://localhost:8080/api/v1/login";

export async function fetchUserFromApi(userName, password) {
  //Skapar headern här för att skicka med längre ner.
  const headers = new Headers();
  headers.set(
    "Authorization",
    "Basic " + btoa(`${userName}:${password}`) // Skapa Basic Auth-sträng
  );

  try {
    const response = await fetch(`${API_BASE_URL_LOGIN}/me`, {
      method: "GET",
      headers: headers,
      credentials: "include", // Tillåt cookies om nödvändigt
    });

    if (response.ok) {
      const userDetails = await response.json(); // Omvandlar svaret till JSON
      console.log("Användare inloggad", userDetails);
      return userDetails;
    } else {
      console.error("Kunde inte hämta användarinformation:", response.status);
      throw new Error("Felaktigt användarnamn eller lösenord");
    }
  } catch (error) {
    console.error("Ett fel uppstod vid API-anrop:", error);
    throw error;
  }
}
