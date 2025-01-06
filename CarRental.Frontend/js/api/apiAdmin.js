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
/*    CUSTOMERS    */
/*******************/

/* GET ALL CUSTOMERS */
export const getAllCustomers = async () => {
  const base64Credentials = btoa(`${username}:${password}`);

  try {
    const response = await fetch(API_BASE_URL_CUSTOMERS, {
      method: "GET",
      headers: {
        Authorization: `Basic ${base64Credentials}`,
      },
    });
    if (!response.ok) {
      throw new Error("Något gick fel vid hämtning av kunder.");
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Fel vid hämtning av kunder:", error);
    throw error;
  }
};

/* GET CUSTOMER BY ID */
export const getCustomerById = async (id) => {
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

/* ADD NEW CUSTOMER */
export async function addNewCustomer(customerData) {
  const base64Credentials = btoa(`${username}:${password}`);
  try {
    const response = await fetch(API_BASE_URL_CUSTOMERS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${base64Credentials}`,
      },
      body: JSON.stringify(customerData), // Skickar kundens data som JSON
    });

    // Kollar om POST-anropet lyckades
    if (response.ok) {
      return await response.json(); // Returnera den sparade kunden
    } else {
      throw new Error("Misslyckades med att lägga till kunden.");
    }
  } catch (error) {
    console.error("Ett fel uppstod:", error);
    throw error; // Kasta vidare felet så det kan hanteras på andra ställen
  }
}

/* UPDATE CUSTOMER */
export async function updateCustomer(customer) {
  const base64Credentials = btoa(`${username}:${password}`);
  const customerId = customer.id;
  try {
    const response = await fetch(`${API_BASE_URL_CUSTOMERS}/${customerId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/Json",
        Authorization: `Basic ${base64Credentials}`,
      },
      body: JSON.stringify(customer),
    });

    if (response.ok) {
      return await response.json();
    } else {
      console.error("Ett fel uppstod:", error);
      throw error; // Kasta vidare felet så det kan hanteras på andra ställen
    }
  } catch (error) {
    console.error("Ett fel uppstod:", error);
    throw error; // Kasta vidare felet så det kan hanteras på andra ställen
  }
}

/* DELETE CUSTOMER */
export const deleteCustomer = async (id) => {
  const base64Credentials = btoa(`${username}:${password}`);

  try {
    const response = await fetch(`${API_BASE_URL_CUSTOMERS}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Basic ${base64Credentials}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Något gick fel vid borttagning av kund med ID ${id}.`);
    }
    // Kolla om svaret har något innehåll (kan vara tomt för 204 No Content)
    if (response.status !== 204) {
      const data = await response.json();
      console.log(data);
      return data;
    } else {
      console.log("Kund borttagen, inget innehåll i svaret.");
      return {}; // Eller returnera ett tomt objekt om inget innehåll finns
    }
  } catch (error) {
    console.error("Fel vid borttagning av kund:", error);
    throw error;
  }
};

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

/* ADD NEW CAR */
export async function addNewCar(vehicleData) {
  const base64Credentials = btoa(`${username}:${password}`); // Skapa credentials med Basic Auth

  try {
    const response = await fetch(API_BASE_URL_CARS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Skickar data som JSON
        Authorization: `Basic ${base64Credentials}`, // Lägg till Authorization-headern
      },
      body: JSON.stringify(vehicleData), // Skicka bilens data som JSON
    });

    // Kontrollera om POST-anropet lyckades
    if (response.ok) {
      return await response.json(); // Returnera den sparade bilen
    } else {
      throw new Error("Misslyckades med att lägga till bilen.");
    }
  } catch (error) {
    console.error("Ett fel uppstod:", error);
    throw error; // Kasta vidare felet så det kan hanteras på andra ställen
  }
}

/* UPDATE CAR */
export async function updateCar(car) {
  const base64Credentials = btoa(`${username}:${password}`);
  const carId = car.id;
  try {
    const response = await fetch(`${API_BASE_URL_CARS}/${carId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/Json",
        Authorization: `Basic ${base64Credentials}`,
      },
      body: JSON.stringify(car),
    });

    if (response.ok) {
      return await response.json();
    } else {
      console.error("Ett fel uppstod:", error);
      throw error; // Kasta vidare felet så det kan hanteras på andra ställen
    }
  } catch (error) {
    console.error("Ett fel uppstod:", error);
    throw error; // Kasta vidare felet så det kan hanteras på andra ställen
  }
}

/* DELETE CAR */
export const deleteCar = async (id) => {
  const base64Credentials = btoa(`${username}:${password}`);

  try {
    const response = await fetch(`${API_BASE_URL_CARS}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Basic ${base64Credentials}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Något gick fel vid borttagning av bil med ID ${id}.`);
    }
    // Kolla om svaret har något innehåll (kan vara tomt för 204 No Content)
    if (response.status !== 204) {
      const data = await response.json();
      console.log(data);
      return data;
    } else {
      console.log("Bil borttagen, inget innehåll i svaret.");
      return {}; // Eller returnera ett tomt objekt om inget innehåll finns
    }
  } catch (error) {
    console.error("Fel vid borttagning av bil:", error);
    throw error;
  }
};

/*******************/
/*     BOOKINGS    */
/*******************/
/* GET ALL BOOKINGS */
export const getAllBookings = async () => {
  const base64Credentials = btoa(`${username}:${password}`);

  try {
    const response = await fetch(API_BASE_URL_BOOKINGS, {
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

/* GET BOOKING BY ID */
export const getBookingById = async (id) => {
  const base64Credentials = btoa(`${username}:${password}`);

  try {
    const response = await fetch(`${API_BASE_URL_BOOKINGS}/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${base64Credentials}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Något gick fel vid hämtning av bokning med ID ${id}.`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Fel vid hämtning av bokning:", error);
    throw error;
  }
};

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

/* UPDATE BOOKING */
export async function updateBooking(booking) {
  const base64Credentials = btoa(`${username}:${password}`);
  const bookingId = booking.id;

  try {
    const response = await fetch(`${API_BASE_URL_BOOKINGS}/${bookingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${base64Credentials}`,
      },
      body: JSON.stringify(booking),
    });

    if (!response.ok) {
      const errorDetails = await response.json();
      throw new Error(`Error: ${response.status} - ${errorDetails.message}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Ett fel uppstod vid uppdatering av bokningen:", error);
    throw error;
  }
}

/* DELETE BOOKING */
export const deleteBooking = async (id) => {
  const base64Credentials = btoa(`${username}:${password}`);

  try {
    const response = await fetch(`${API_BASE_URL_BOOKINGS}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Basic ${base64Credentials}`,
      },
    });
    if (!response.ok) {
      throw new Error(
        `Något gick fel vid borttagning av bokning med ID ${id}.`
      );
    }
    // Kolla om svaret har något innehåll (kan vara tomt för 204 No Content)
    if (response.status !== 204) {
      const data = await response.json();
      console.log(data);
      return data;
    } else {
      console.log("Bokning borttagen, inget innehåll i svaret.");
      return {}; // Eller returnera ett tomt objekt om inget innehåll finns
    }
  } catch (error) {
    console.error("Fel vid borttagning av bokning:", error);
    throw error;
  }
};
