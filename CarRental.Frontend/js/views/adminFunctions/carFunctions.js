const moduleAdmin = await import("/js/api/apiAdmin.js");

/* const appContentEl = document.getElementById("adminContent"); */

/* SHOW ALL CARS */
export async function showAllCars() {
  try {
    const cars = await moduleAdmin.getAllCars();

    if (cars && cars.length > 0) {
      return `
        <h2 class="text-center">Alla Bilar</h2>
        <table class="cars-table">
          <thead>
            <tr class="clickable">
              <th data-type="none">Välj</th>
              <th data-type="number">ID</th>
              <th data-type="string">Märke</th>
              <th data-type="string">Modell</th>
              <th data-type="string">Utrustning 1</th>
              <th data-type="string">Utrustning 2</th>
              <th data-type="string">Utrustning 3</th>
              <th data-type="string">Typ</th>
              <th data-type="number">Pris</th>
              <th data-type="number">Booked</th>
            </tr>
          </thead>
          <tbody>
            ${cars
              .map(
                (car) => `
               <tr>
                <td><input type="checkbox" class="delete-checkbox" value="${car.id}"></td>
                  <td>${car.id}</td>
                  <td>${car.name}</td>
                  <td>${car.model}</td>
                  <td>${car.feature1}</td>
                  <td>${car.feature2}</td>
                  <td>${car.feature3}</td>
                  <td>${car.type}</td>
                  <td>${car.price}</td>
                  <td>${car.booked}</td>
                </tr>
              `
              )
              .join("")}
          </tbody>
        </table>
        <button id="updateSelectedCar" class="btn btn-neutral">Uppdatera Bil</button>
        <button id="deleteSelectedCars" class="btn btn-negative">Radera Valda Bilar</button>
      `;
    } else {
      return `<h1>Inga bilar att visa</h1>`;
    }
  } catch (error) {
    console.error("Kunde inte hämta bilar:", error);
    return `<h1>Ett fel uppstod när bilar hämtades.</h1>`;
  }
}

export async function handleDeleteSelectedCars() {
  const checkboxes = document.querySelectorAll(".delete-checkbox:checked"); // Hämta alla valda checkboxar
  const selectedIds = Array.from(checkboxes).map((checkbox) => checkbox.value); // Hämta ID:n från de valda checkboxarna

  if (selectedIds.length > 0) {
    try {
      // Anropa API för att ta bort varje vald kund
      for (const id of selectedIds) {
        await moduleAdmin.deleteCar(id);
      }
      alert("De valda bilarna har raderats.");
      // Gör om proceduren att ladda inna alla kunder.
      const moduleMyPagesAdmin = await import("/js/views/myPagesAdmin.js");
      moduleMyPagesAdmin.renderAdminContent("viewAllCars");
    } catch (error) {
      console.error("Kunde inte radera bilar:", error);
      alert("Ett fel uppstod när bilar skulle raderas.");
    }
  } else {
    alert("Vänligen välj minst en bil att ta bort.");
  }
}

export async function handleUpdateSelectedCars() {
  const selectedCars = Array.from(
    document.querySelectorAll(".delete-checkbox:checked")
  ).map((checkbox) => checkbox.value);

  // Kontrollera om mer än en kund är vald
  if (selectedCars.length !== 1) {
    alert("Endast ett val är giltigt. Vänligen välj en bil att uppdatera.");
    const moduleMyPagesAdmin = await import("/js/views/myPagesAdmin.js");
    moduleMyPagesAdmin.renderAdminContent("viewAllCars");
    return;
  }

  console.log("Valda kund-ID:n:", selectedCars); // Debugging

  // Här kan du skicka förfrågan till backend för att uppdatera de valda kunderna
  const car = await moduleAdmin.getCarById(selectedCars);
  console.log("Customer från API:", car); // Debugging
  return updateCarForm(car);
}

export async function updateCar(car) {
  // Här gör du en API-anrop för att uppdatera de valda kunderna
  // Till exempel kan du anropa en funktion som sköter API-anropet
  console.log("Uppdaterar följande bilar:", car);
  const addedCustomer = await moduleAdmin.updateCar(car);

  // Efter uppdatering, visa ett meddelande eller ladda om innehållet
  alert(`Bil med Id ${car.id} har uppdaterats.`);
  const moduleMyPagesAdmin = await import("/js/views/myPagesAdmin.js");
  moduleMyPagesAdmin.renderAdminContent("viewAllCars");
}

export function updateCarForm(selectedCar) {
  return `
        <h1>Uppdatera kund</h1>
    <form class="form" id="update-customer-form">
    <div class="form-item">
        <label for="carId">Kund ID:</label>
        <input type="text" id="carId" name="customerId" value="${selectedCar.id}" readonly>
      </div>
      <div class="form-item">
        <label for="name">Märke:</label>
        <input type="text" id="name" name="name" value="${selectedCar.name}" required>
      </div>
      <div class="form-item">
        <label for="model">Modell:</label>
        <input type="text" id="model" name="model" value="${selectedCar.model}" required>
      </div>
      <div class="form-item">
        <label for="feature1">Utrustning 1:</label>
        <input type="text" id="feature1" name="feauture1" value="${selectedCar.feature1}" required>
      </div>
      <div class="form-item">
        <label for="feature2">Utrustning 2:</label>
        <input type="text" id="feature2" name="feature2" value="${selectedCar.feature2}" required>
      </div>
      <div class="form-item">
        <label for="feature3">Utrustning 3:</label>
        <input type="text" id="feature3" name="feature3" value="${selectedCar.feature3}" required>
      </div>
      <div class="form-item">
        <label for="type">Typ:</label>
        <input type="text" id="type" name="type" value="${selectedCar.type}" required>
      </div>
      <div class="form-item">
        <label for="price">Pris:</label>
        <input type="text" id="price" name="price" value="${selectedCar.price}" required>
      </div>
      <div class="form-item">
        <label for="booked">Bokad:</label>
        <input type="text" id="booked" name="booked" value="${selectedCar.booked}" required>
      </div>
      <button type="submit" class="btn btn-positive" id="updateCar">Uppdatera Bil</button>
    </form>
  `;
}

/* ADD NEW CAR */
export function addVehicleForm() {
  return `
        <h3>Lägg till en ny bil</h3>
        <form class="form" id="add-vehicle-form">
        <div class="form-item">
          <label for="name">Namn:</label>
          <input type="text" id="name" name="name" required>
        </div>
        <div class="form-item">
          <label for="model">Modell:</label>
          <input type="text" id="model" name="model" required>
        </div>
        <div class="form-item">
          <label for="feature1">Egenskap 1:</label>
          <input type="text" id="feature1" name="feature1" required>
          </div>
        <div class="form-item">
          <label for="feature2">Egenskap 2:</label>
          <input type="text" id="feature2" name="feature2" required>
        </div>
        <div class="form-item">
          <label for="feature3">Egenskap 3:</label>
          <input type="text" id="feature3" name="feature3" required>
          </div>
          <div class="form-item">
          <label for="type">Typ:</label>
          <input type="text" id="type" name="type" required>
          </div>
        <div class="form-item">
          <label for="price">Pris:</label>
          <input type="number" id="price" name="price" step="0.01" required>
         </div>
          <button type="submit" class="btn btn-positive">Lägg till bil</button>
        </form>
      `;
}

export async function handleAddVehicleForm() {
  const form = document.getElementById("add-vehicle-form");
  console.log("handleAddVehicleForm..");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const vehicleData = {
      name: form.name.value,
      model: form.model.value,
      feature1: form.feature1.value,
      feature2: form.feature2.value,
      feature3: form.feature3.value,
      type: form.type.value,
      price: parseFloat(form.price.value),
      booked: 0, // Ny bil är inte bokad
    };

    try {
      // Anropar API-funktionen för att lägga till bilen
      const addedCar = await moduleAdmin.addNewCar(vehicleData);

      // Om det gick bra
      alert("Bilen har lagts till!");
      form.reset(); // Rensa formuläret
      console.log("Ny bil tillagd:", addedCar); // Visa den nya bilen i konsolen (kan vara bra för felsökning)
    } catch (error) {
      // Om något gick fel
      console.error("Kunde inte lägga till bilen:", error);
      alert("Det gick inte att lägga till bilen. Försök igen.");
    }
  });
}
