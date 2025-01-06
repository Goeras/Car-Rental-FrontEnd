const API_BASE_URL_CARS = "http://localhost:8080/api/v1/cars";
const API_BASE_URL_CUSTOMERS = "http://localhost:8080/api/v1/customers";
const API_BASE_URL_BOOKINGS = "http://localhost:8080/api/v1/bookings";

const loggedInUser = sessionStorage.getItem("loggedInUser");
let username;
let password;

// Om loggedInUser finns och är en JSON-sträng, parsar vi det till ett objekt
if (loggedInUser) {
  const userObject = JSON.parse(loggedInUser); // Parsar JSON-strängen till ett objekt

  // Hämta användarnamnet
  username = userObject.username;
  password = userObject.password;
} else {
  console.log("Ingen användare är inloggad.");
}

/*******************/
/*       CARS      */
/*******************/

/* GET ALL CARS */
export const getAllCars = async () => {
  const base64Credentials = btoa(`${username}:${password}`);

  try {
    const response = await fetch(API_BASE_URL_CARS, {
      method: "GET",
      headers: {
        Authorization: `Basic ${base64Credentials}`,
      },
    });
    if (!response.ok) {
      throw new Error("Något gick fel vid hämtning av bilar.");
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Fel vid hämtning av bilar:", error);
    throw error;
  }
};

/* GET CAR BY ID */
export const getCarById = async (id) => {
  const base64Credentials = btoa(`${username}:${password}`);

  try {
    const response = await fetch(`${API_BASE_URL_CARS}/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${base64Credentials}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Något gick fel vid hämtning av bil med ID ${id}.`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Fel vid hämtning av bil:", error);
    throw error;
  }
};

/*******************/
/*    CUSTOMERS    */
/*******************/

// Customer By ID
export const getUserById = async (id) => {
  const base64Credentials = btoa(`${username}:${password}`);

  try {
    const response = await fetch(`${API_BASE_URL_CUSTOMERS}/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${base64Credentials}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Något gick fel vid hämtning av kund med ID ${id}.`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Fel vid hämtning av kund:", error);
    throw error;
  }
};

export const getAllOrders = async () => {
  const base64Credentials = btoa(`${username}:${password}`);

  try {
    const response = await fetch(`${API_BASE_URL_CUSTOMERS}/orders`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${base64Credentials}`,
      },
    });
    if (!response.ok) {
      throw new Error("Något gick fel vid hämtning av bokningar.");
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Fel vid hämtning av bokningar:", error);
    throw error;
  }
};

// Customer Order (customer ID)
export const getOrdersByCustomerId = async (id) => {
  const base64Credentials = btoa(`${username}:${password}`);

  try {
    const response = await fetch(`${API_BASE_URL_CUSTOMERS}/orders/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${base64Credentials}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Något gick fel vid hämtning av bokningar.");
    }

    const data = await response.json();
    console.log("Hämtade bokningar:", data);
    return data;
  } catch (error) {
    console.error("Fel vid hämtning av bokningar:", error);
    throw error;
  }
};

/*******************/
/*     BOOKINGS    */
/*******************/

/* ADD NEW BOOKING */
export async function addNewBooking(bookingData) {
  const base64Credentials = btoa(`${username}:${password}`); // Skapa credentials med Basic Auth

  try {
    const response = await fetch(API_BASE_URL_BOOKINGS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Skickar data som JSON
        Authorization: `Basic ${base64Credentials}`, // Lägg till Authorization-headern
      },
      body: JSON.stringify(bookingData), // Skicka bokningens data som JSON
    });

    // Kontrollera om POST-anropet lyckades
    if (response.ok) {
      // Om det finns ett svar, returnera det som JSON
      if (response.headers.get("Content-Length") !== "0") {
        return await response.json();
      } else {
        return { message: "Bokningen skapades framgångsrikt." }; // Custom meddelande
      }
    } else {
      throw new Error("Misslyckades med att lägga till bokningen.");
    }
  } catch (error) {
    console.error("Ett fel uppstod:", error);
    throw error; // Kasta vidare felet så det kan hanteras på andra ställen
  }
}
