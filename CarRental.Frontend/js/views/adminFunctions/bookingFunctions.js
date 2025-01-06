const moduleAdmin = await import("/js/api/apiAdmin.js");

/* const appContentEl = document.getElementById("adminContent"); */

/* GET ALL BOOKINGS */
export async function showAllBookings() {
  try {
    // Hämta kunder från backend via moduleAdmin
    const bookings = await moduleAdmin.getAllBookings();

    // Kontrollera om kunder returnerades
    if (bookings && bookings.length > 0) {
      // Bygg tabellen
      return `
            <h2 class="text-center">Alla Bokningar</h2>
            <table class="bookings-table">
              <thead>
                <tr class="clickable">
                  <th data-type="none">Välj</th>
                  <th data-type="number">ID</th>
                  <th data-type="string">Från</th>
                  <th data-type="string">Till</th>
                  <th data-type="number">Kund ID</th>
                  <th data-type="number">Bil ID</th>
                  <th data-type="string">Aktiv?</th>
                </tr>
              </thead>
              <tbody>
                ${bookings
                  .map(
                    (booking) => `
                  <tr>
                  <td><input type="checkbox" class="delete-checkbox" value="${
                    booking.id
                  }"></td>
                    <td>${booking.id}</td>
                    <td>${booking.from_date}</td>
                    <td>${booking.to_date}</td>
                    <td>${booking.customerId}</td>
                    <td>${booking.car_id}</td>
                    <td>${booking.active === 1 ? "Ja" : "Nej"}</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
            <button id="updateSelectedBooking" class="btn btn-neutral">Uppdatera bokning</button>
            <button id="deleteSelectedBookings" class="btn btn-negative">Radera Valda Bokningar</button>
          `;
    } else {
      // Om inga kunder returneras
      return `<h1>Inga bokningar att visa</h1>`;
    }
  } catch (error) {
    console.error("Kunde inte hämta bokningar:", error);
    return `<h1>Ett fel uppstod när bokningar hämtades.</h1>`;
  }
}

// Delete Handle
export async function handleDeleteSelectedBookings() {
  const checkboxes = document.querySelectorAll(".delete-checkbox:checked"); // Hämta alla valda checkboxar
  const selectedIds = Array.from(checkboxes).map((checkbox) => checkbox.value); // Hämta ID:n från de valda checkboxarna

  if (selectedIds.length > 0) {
    try {
      // Anropa API för att ta bort varje vald bokning
      for (const id of selectedIds) {
        await moduleAdmin.deleteBooking(id);
      }
      alert("De valda bokningarna har raderats.");
      // Gör om proceduren att ladda inna alla bokningar.
      const moduleMyPagesAdmin = await import("/js/views/myPagesAdmin.js");
      moduleMyPagesAdmin.renderAdminContent("viewAllBookings");
    } catch (error) {
      console.error("Kunde inte radera bokningar:", error);
      alert("Ett fel uppstod när bokningar skulle raderas.");
    }
  } else {
    alert("Vänligen välj minst en bokning att ta bort.");
  }
}

//Update Handle
export async function handleUpdateSelectedBookings() {
  const selectedBookingId = Array.from(
    document.querySelectorAll(".delete-checkbox:checked")
  ).map((checkbox) => checkbox.value);

  // Kontrollera om mer än en kund är vald
  if (selectedBookingId.length !== 1) {
    alert("Endast ett val är giltigt. Vänligen välj en boking att uppdatera.");
    const moduleMyPagesAdmin = await import("/js/views/myPagesAdmin.js");
    moduleMyPagesAdmin.renderAdminContent("viewAllBookings");
    return;
  }

  // Här kan du skicka förfrågan till backend för att uppdatera de valda kunderna
  /* const booking = await moduleAdmin.getBookingById(selectedBookings); */
  const booking = await findBookingByIdFromAll(selectedBookingId);
  return updateBookingForm(booking);
}

export async function updateBooking(booking) {
  const addedBooking = await moduleAdmin.updateBooking(booking);
  alert(`Bokning med Id ${booking.id} har uppdaterats.`);
  const moduleMyPagesAdmin = await import("/js/views/myPagesAdmin.js");
  moduleMyPagesAdmin.renderAdminContent("viewAllBookings");
}

/* Update booking form */
export function updateBookingForm(selectedBooking) {
  return `
          <h1>Uppdatera bokning</h1>
      <form class="form" id="update-customer-form">
      <div class="form-item">
          <label for="bookingId">Boknings ID:</label>
          <input type="text" id="bookingId" name="bookingId" value="${selectedBooking.id}" readonly>
        </div>
        <div class="form-item">
          <label for="from_date">Från:</label>
          <input type="text" id="from_date" name="from_date" value="${selectedBooking.from_date}" required>
        </div>
        <div class="form-item">
          <label for="to_date">Till:</label>
          <input type="text" id="to_date" name="to_date" value="${selectedBooking.to_date}" required>
        </div>
        <div class="form-item">
          <label for="customerId">Kund ID:</label>
          <input type="text" id="customerId" name="customerId" value="${selectedBooking.customerId}" required>
        </div>
        <div class="form-item">
          <label for="car_id">Bil ID:</label>
          <input type="text" id="car_id" name="car_id" value="${selectedBooking.car_id}" required>
        </div>
        <button type="submit" class="btn btn-positive" id="updateBooking">Uppdatera bokning</button>
      </form>
    `;
}

/* ADD NEW BOOKING */
export function addBookingForm() {
  return `
        <h3>Lägg till en ny bokning</h3>
        <form class="form" id="add-booking-form">
        <div class="form-item">
          <label for="from_date">Från datum:</label>
          <input type="text" id="from_date" name="from_date" placeholder="2025-12-24" required>
        </div>
        <div class="form-item">
          <label for="to_date">Till datum:</label>
          <input type="text" id="to_date" name="to_date" placeholder="2025-12-25" required>
        </div>
        <div class="form-item">
          <label for="customerId">Kund ID:</label>
          <input type="text" id="customerId" name="customerId" required>
        </div>
        <div class="form-item">
          <label for="car_id">Bil ID:</label>
          <input type="text" id="car_id" name="car_id" required>
        </div>
          <button type="submit" class="btn btn-positive">Lägg till bokning</button>
        </form>
    `;
}

export async function handleAddBookingForm() {
  const form = document.getElementById("add-booking-form");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const bookingData = {
      from_date: form.from_date.value,
      to_date: form.to_date.value,
      customerId: form.customerId.value,
      car_id: form.car_id.value,
    };

    // Kontrollera om fromDate är tidigare än toDate
    if (bookingData.from_date >= bookingData.to_date) {
      alert(
        "Kontrollera datum för bokningen. Från-datum måste vara tidigare än Till-datum."
      );
    } else {
      try {
        // Kollar om bilen är ledig under den angivna tidsperioden
        const isAvailable = await availableDate(bookingData);

        // Om bilen är ledig
        if (isAvailable) {
          const addedBooking = await moduleAdmin.addNewBooking(bookingData);

          // Om det gick bra
          alert("Bokningen har lagts till!");
          form.reset(); // Rensa formuläret i konsolen
        } else {
          alert("Bilen är redan bokad under den angivna tidsperioden.");
        }
      } catch (error) {
        // Om något gick fel
        console.error("Kunde inte lägga till bokning:", error);
        alert(
          "Det gick inte att lägga till bokningen. Kontrollera inmatningen."
        );
      }
    }
  });
}

export async function findBookingByIdFromAll(id) {
  const numericId = Number(id); // Konvertera id till ett nummer

  // Hämtar alla bokningar från moduleAdmin
  const allBookings = await moduleAdmin.getAllBookings();

  // Filtrera fram den bokning som matchar id
  const booking = allBookings.find((booking) => booking.id === numericId);

  return booking;
}

// Kolla lediga datum.
export async function availableDate(bookingData) {
  const carId = bookingData.car_id;
  const fromDate = new Date(bookingData.from_date);
  const toDate = new Date(bookingData.to_date);

  const allBookings = await moduleAdmin.getAllBookings();

  // Hämta bokningar för den specifika bilen. jämför ID som strängar.
  const carBookings = allBookings.filter(
    (booking) => String(booking.car_id) === String(carId)
  );

  // Kontrollera om något av de befintliga bokningarna överlappar med de önskade datumen
  const isAvailable = carBookings.every((booking) => {
    const existingFromDate = new Date(booking.from_date);
    const existingToDate = new Date(booking.to_date);

    // Kontrollera om det inte finns någon överlappning
    return toDate < existingFromDate || fromDate > existingToDate;
  });

  return isAvailable; // Returnera true om bilen är ledig, annars false
}
