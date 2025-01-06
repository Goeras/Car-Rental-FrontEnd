const moduleCustomerFunctions = await import(
  "/js/views/userFunctions/customerFunctions.js"
);

const appContentEl = document.getElementById("app");

/********/
/* USER */
/********/

export function showMyPagesUser() {
  sessionStorage.setItem("currentView", "showMyPagesUser");
  appContentEl.innerHTML = "";
  console.log("inne i bookings.js filen, showBookings");

  const content = `
    <div class="center-content">
        <button class="btn btn-negative" id="logout">Logga ut</button>
        <div>
            <input type="text" class="input-size" id="id" name="id" placeholder="Användar-ID">
            <button class="btn" id="getCustomer">Hämta användare</button>
        </div>  
        <div class="margin-top" id="userContent">
            <img
                class="logo-big shadow-box"
                alt="Wigells Car Rental logo"
                src="pics/logotype.jpeg"
            />
        </div>
    </div>
  `;
  appContentEl.innerHTML = content;

  document.getElementById("getCustomer").addEventListener("click", () => {
    const userId = document.getElementById("id").value; // Hämta ID från inputfältet
    renderUserContent("viewCustomer", userId); // Skicka ID:t till renderUserContent
  });
  document
    .getElementById("logout")
    .addEventListener("click", () => handleLogout());
}

// Dynamisk renderingsfunktion
export function renderUserContent(action, userId) {
  switch (action) {
    case "viewCustomer":
      moduleCustomerFunctions
        .showCustomer(userId)
        .then((content) => {
          userContent.innerHTML = content;
          addSortingToTables();
        })
        .catch((error) => {
          console.error("Ett fel uppstod:", error);
          userContent.innerHTML = `<h2>Ett fel uppstod när innehållet laddades.</h2>`;
        });
      break;
    default:
      userContent.innerHTML = `<h2>Välj en funktionalitet ovan</h2>`;
  }
}

// Logga ut-funktion
function handleLogout() {
  sessionStorage.removeItem("loggedInUser");
  console.log("Användaren har loggat ut.");
  import("./login.js").then((module) => module.login());
}

function addSortingToTables() {
  $(document).ready(function () {
    console.log("inne i sorteringen");
    $(".bookings-table th, .cars-table th, .customers-table th")
      .off("click")
      .on("click", function () {
        const table = $(this).closest("table");
        const tbody = table.find("tbody");
        const rows = tbody.find("tr").get();
        const columnIndex = $(this).index();
        const type = $(this).data("type");
        let sortOrder = $(this).data("order") || "asc";

        // Sortera rader
        rows.sort((a, b) => {
          const cellA = $(a).children("td").eq(columnIndex).text();
          const cellB = $(b).children("td").eq(columnIndex).text();

          if (type === "number") {
            return sortOrder === "asc"
              ? parseFloat(cellA) - parseFloat(cellB)
              : parseFloat(cellB) - parseFloat(cellA);
          } else if (type === "string") {
            return sortOrder === "asc"
              ? cellA.localeCompare(cellB)
              : cellB.localeCompare(cellA);
          } else {
            return 0;
          }
        });

        // Växla sorteringsordning
        sortOrder = sortOrder === "asc" ? "desc" : "asc";
        $(this).data("order", sortOrder);

        // Förhindra att sorteringsrader dupliceras
        tbody.empty(); // Ta bort alla befintliga rader innan sortering

        // Lägg till sorterade rader på nytt
        $.each(rows, (_, row) => {
          tbody.append(row);
        });
      });
  });
}
