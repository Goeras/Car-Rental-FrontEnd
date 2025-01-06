const moduleCustomerFunctions = await import(
  "/js/views/adminFunctions/customerFunctions.js"
);
const moduleCarFunctions = await import(
  "/js/views/adminFunctions/carFunctions.js"
);
const moduleBookingFunctions = await import(
  "/js/views/adminFunctions/bookingFunctions.js"
);

const appContentEl = document.getElementById("app");

/*********/
/* ADMIN */
/*********/

export function showMyPagesAdmin() {
  sessionStorage.setItem("currentView", "showMyPagesAdmin");
  appContentEl.innerHTML = "";
  console.log("inne i bookings.js filen, showBookings");

  const content = `
  <div class="center-content">
    <div>
      <button class="btn btn-negative" id="logout">Logga Ut</button>
      <div class="grid grid--3-cols">
        <div class="btn-box">
          <h4>Kunder</h4>
          <button class="btn btn-neutral" id="viewAllCustomers">Alla Kunder</button>
          <button class="btn btn-neutral" id="newCustomer">Ny Kund</button>
        </div>
        <div class="btn-box">
          <h4>Bilar</h4>
          <button class="btn btn-neutral" id="viewAllCars">Alla Bilar</button>
          <button class="btn btn-neutral" id="newCar">Ny Bil</button>
        </div>
        <div class="btn-box">
         <h4>Bokningar</h4>
          <button class="btn btn-neutral" id="viewAllBookings">Alla Bokningar</button>
          <button class="btn btn-neutral" id="newBooking">Ny Bokning</button>
        </div>
      </div>
    </div>
    <div class="margin-top" id="adminContent">
      <img
          class="logo-big shadow-box"
          alt="Wigells Car Rental logo"
          src="pics/logotype.jpeg"
        />
    </div>
    </div>
  `;
  appContentEl.innerHTML = content;

  // Eventlyssnare för knappar
  document
    .getElementById("viewAllCustomers")
    .addEventListener("click", () => renderAdminContent("viewAllCustomers"));
  document
    .getElementById("newCustomer")
    .addEventListener("click", () => renderAdminContent("newCustomer"));
  document
    .getElementById("viewAllCars")
    .addEventListener("click", () => renderAdminContent("viewAllCars"));
  document
    .getElementById("newCar")
    .addEventListener("click", () => renderAdminContent("newCar"));
  document
    .getElementById("viewAllBookings")
    .addEventListener("click", () => renderAdminContent("viewAllBookings"));
  document
    .getElementById("newBooking")
    .addEventListener("click", () => renderAdminContent("newBooking"));
  document
    .getElementById("logout")
    .addEventListener("click", () => handleLogout());
}

// Dynamisk renderingsfunktion
export function renderAdminContent(action) {
  const adminContent = document.getElementById("adminContent");

  switch (action) {
    case "viewAllCustomers":
      moduleCustomerFunctions
        .showAllCustomers()
        .then((content) => {
          adminContent.innerHTML = content;
          addSortingToTables();
          document
            .getElementById("deleteSelectedCustomers")
            .addEventListener(
              "click",
              moduleCustomerFunctions.handleDeleteSelectedCustomers
            );
          document
            .getElementById("updateSelectedCustomer")
            .addEventListener("click", async () => {
              const content =
                await moduleCustomerFunctions.handleUpdateSelectedCustomers();
              updateCustomerContent(content);
            });
        })
        .catch((error) => {
          console.error("Ett fel uppstod:", error);
          adminContent.innerHTML = `<h2>Ett fel uppstod när innehållet laddades.</h2>`;
        });

      break;
    case "newCustomer":
      adminContent.innerHTML = moduleCustomerFunctions.addCustomerForm();
      moduleCustomerFunctions.handleAddCustomerForm();
      break;
    case "viewAllCars":
      moduleCarFunctions
        .showAllCars()
        .then((content) => {
          adminContent.innerHTML = content;
          addSortingToTables();
          document
            .getElementById("deleteSelectedCars")
            .addEventListener(
              "click",
              moduleCarFunctions.handleDeleteSelectedCars
            );
          document
            .getElementById("updateSelectedCar")
            .addEventListener("click", async () => {
              const content =
                await moduleCarFunctions.handleUpdateSelectedCars();

              updateCarContent(content);
            });
        })
        .catch((error) => {
          console.error("Ett fel uppstod:", error);
          adminContent.innerHTML = `<h2>Ett fel uppstod när innehållet laddades.</h2>`;
        });
      break;
    case "newCar":
      adminContent.innerHTML = moduleCarFunctions.addVehicleForm();
      moduleCarFunctions.handleAddVehicleForm();
      break;
    case "viewAllBookings":
      moduleBookingFunctions
        .showAllBookings()
        .then((content) => {
          adminContent.innerHTML = content;
          addSortingToTables();
          document
            .getElementById("deleteSelectedBookings")
            .addEventListener(
              "click",
              moduleBookingFunctions.handleDeleteSelectedBookings
            );
          document
            .getElementById("updateSelectedBooking")
            .addEventListener("click", async () => {
              const content =
                await moduleBookingFunctions.handleUpdateSelectedBookings();

              updateBookingContent(content);
            });
        })
        .catch((error) => {
          console.error("Ett fel uppstod:", error);
          adminContent.innerHTML = `<h2>Ett fel uppstod när innehållet laddades.</h2>`;
        });
      break;
    case "newBooking":
      adminContent.innerHTML = moduleBookingFunctions.addBookingForm();
      moduleBookingFunctions.handleAddBookingForm();
      break;
    default:
      adminContent.innerHTML = `<h2>Välj en funktionalitet ovan</h2>`;
  }
}

function updateCustomerContent(content) {
  adminContent.innerHTML = content;
  const form = document.getElementById("update-customer-form");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const updatedCustomer = {
      id: form.customerId.value,
      firstName: form.firstName.value,
      lastName: form.lastName.value,
      customerName: form.customerName.value,
      phone: form.phone.value,
      email: form.email.value,
      password: form.password.value,
    };
    try {
      // Anropa en funktion för att skicka uppdaterade kunddata till servern
      await moduleCustomerFunctions.updateCustomers(updatedCustomer);
    } catch (error) {
      console.error("Fel vid uppdatering av kund:", error);
      alert("Något gick fel, försök igen senare.");
    }
  });
}

function updateCarContent(content) {
  adminContent.innerHTML = content;
  const form = document.getElementById("update-customer-form");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const updatedCar = {
      id: form.carId.value,
      name: form.name.value,
      model: form.model.value,
      feature1: form.feature1.value,
      feature2: form.feature2.value,
      feature3: form.feature3.value,
      type: form.type.value,
      price: form.price.value,
      booked: form.booked.value,
    };
    try {
      // Anropa en funktion för att skicka uppdaterade kunddata till servern
      await moduleCarFunctions.updateCar(updatedCar);
    } catch (error) {
      console.error("Fel vid uppdatering av kund:", error);
      alert("Något gick fel, försök igen senare.");
    }
  });
}

function updateBookingContent(content) {
  adminContent.innerHTML = content;
  const form = document.getElementById("update-customer-form");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const updatedBooking = {
      id: form.bookingId.value,
      from_date: form.from_date.value,
      to_date: form.to_date.value,
      customerId: form.customerId.value,
      car_id: form.car_id.value,
    };
    try {
      // Anropa en funktion för att skicka uppdaterade kunddata till servern
      await moduleBookingFunctions.updateBooking(updatedBooking);
    } catch (error) {
      console.error("Fel vid uppdatering av bokning:", error);
      alert("Något gick fel, försök igen senare.");
    }
  });
}

// Logga ut-funktion
function handleLogout() {
  sessionStorage.removeItem("loggedInUser");
  console.log("Användaren har loggat ut.");
  // Dirigera användaren till inloggningssidan
  import("./login.js").then((module) => module.login());
}

// Sortera tabeller med jQuery. Funktionen läggs till i renderAdminContent (rad 80) i varje view i switch-satsen. Datatypen för varje kolumn anges i data-attributet i th-elementet när tabellerna skapas.
function addSortingToTables() {
  $(document).ready(function () {
    // Vänta tills hela sidan har laddats
    $(".bookings-table th, .cars-table th, .customers-table th")
      .off("click") // tar bort eventuella tidigare click-event
      .on("click", function () {
        // Lägg till click-event
        const table = $(this).closest("table"); // Hitta närmaste tabell där elementet finns
        const tbody = table.find("tbody"); // Hitta tbody-elementet i tabellen
        const rows = tbody.find("tr").get(); // Hämta alla rader i tabellen
        const columnIndex = $(this).index(); // Hämta index för kolumnen som klickades på
        const type = $(this).data("type"); // Hämta datatyp för kolumnen
        let sortOrder = $(this).data("order") || "asc"; // Hämta sorteringsordning (eller sätt till "asc" om det inte finns)

        // Sortera rader
        rows.sort((a, b) => {
          // Ittirerar igenom alla rader och jämför dem
          // Jämför två rader
          const cellA = $(a).children("td").eq(columnIndex).text(); // Hämta texten i cellen för rad a
          const cellB = $(b).children("td").eq(columnIndex).text(); // Hämta texten i cellen för rad b

          if (type === "number") {
            // Om datatypen är nummer används parseFloat fär att konvertera till flyttal
            return sortOrder === "asc" // Om sorteringsordningen är "asc"
              ? parseFloat(cellA) - parseFloat(cellB) // Sortera i stigande ordning
              : parseFloat(cellB) - parseFloat(cellA); // Annars sortera i fallande ordning
          } else if (type === "string") {
            // Om datatypen är sträng anvädns localeCompare för att sortera.
            return sortOrder === "asc"
              ? cellA.localeCompare(cellB)
              : cellB.localeCompare(cellA);
          } else {
            return 0; // Om datatypen inte är angiven returneras 0
          }
        });

        // Växla sorteringsordning
        sortOrder = sortOrder === "asc" ? "desc" : "asc"; // Om sorteringsordningen är "asc" sätt till "desc" och vice versa
        $(this).data("order", sortOrder); // Spara sorteringsordningen i data-attributet

        // Förhindra att sorteringsrader dupliceras
        tbody.empty(); // Ta bort alla befintliga rader innan sortering

        // Lägg till sorterade rader på nytt
        $.each(rows, (_, row) => {
          tbody.append(row);
        });
      });
  });
}
