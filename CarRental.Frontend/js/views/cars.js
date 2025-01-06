const moduleUserAPI = await import("/js/api/apiUser.js");
const moduleCarFunctionUser = await import(
  "/js/views/userFunctions/carFunctions.js"
);

const appContentEl = document.getElementById("app");
let cars = []; // Global variabel för att lagra bilobjekten

/* GET ALL CARS - USER */
export async function showAllCars() {
  appContentEl.innerHTML = "";

  try {
    // Spara till sessionStorage!
    sessionStorage.setItem("currentView", "showAllCars");

    cars = await moduleUserAPI.getAllCars();

    const sortButtons = document.createElement("div");
    sortButtons.innerHTML = `
      <div class="sort-buttons grid grid--2-cols">
        <button class="btn btn-neutral btn-sort" id="sort-by-name">Sortera efter namn</button>
        <button class="btn btn-neutral btn-sort" id="sort-by-type">Sortera efter typ</button>
      </div>
      <div id="cars-container" class="grid grid--2-cols"></div>
    `;
    appContentEl.appendChild(sortButtons);

    // Lägg till event listeners för sorteringsknapparna
    document
      .getElementById("sort-by-name")
      .addEventListener("click", () => sortCars("name"));
    document
      .getElementById("sort-by-type")
      .addEventListener("click", () => sortCars("type"));

    renderCars(cars);
  } catch (error) {
    console.error("Fel vid hämtning av bilar:", error);
    appContentEl.innerHTML =
      "<h2>Det uppstod ett fel vid hämtning av bilarna.</h2>";
  }
}

function renderCars(cars) {
  const carsContainer = document.getElementById("cars-container");
  carsContainer.innerHTML = ""; // Rensa tidigare innehåll

  cars.forEach((car) => {
    // Dynamiskt skapa bildsökvägen
    const imagePath = `/pics/cars/${car.name.toLowerCase()}-${car.model.toLowerCase()}.jpg`;
    const translatedType = translateCarType(car.type);

    // Skapa bilkortet med data-id
    const carCard = document.createElement("div");
    carCard.className = "car-card shadow-box clickable";
    carCard.setAttribute("data-id", car.id); // Sätt bilens id i data-id

    // Lägg till HTML-innehåll i bilkortet
    carCard.innerHTML = `
      <img 
        src="${imagePath}" 
        alt="${car.name}" 
        class="car-image" 
        onerror="this.src='/pics/cars/default.jpg'" /> <!-- Fallback-bild -->
      <div class="car-info">
        <h2>${car.name} ${car.model}</h2>
        <ul class="car-features">
          <li>${car.feature1}</li>
          <li>${car.feature2}</li>
          <li>${car.feature3}</li>
          <li class="car-type">Typ: ${translatedType}</li>
        </ul>
        <p class="car-price">${car.price} SEK / dag</p>
      </div>
    `;

    // Lägg till klickhändelse på bilkortet
    carCard.addEventListener("click", () => {
      const carId = carCard.getAttribute("data-id");
      console.log("Bilens ID:", carId);
      showCarById(carId);
    });

    // Lägg till bilkortet i containern
    carsContainer.appendChild(carCard);
  });
}

function sortCars(criteria) {
  if (criteria === "name") {
    cars.sort((a, b) => a.name.localeCompare(b.name));
  } else if (criteria === "type") {
    cars.sort((a, b) =>
      translateCarType(a.type).localeCompare(translateCarType(b.type))
    );
  }
  renderCars(cars);
}

// Funktion som översätter bilens typ
function translateCarType(carType) {
  const typeMapping = {
    l: "Liten",
    s: "Stor",
    m: "Medium",
    r: "Rolig",
  };

  return typeMapping[carType] || "okänd"; // Fallback till "okänd" om typen inte finns
}

/* GET CAR BY ID - USER */
export async function showCarById(id) {
  appContentEl.innerHTML = "";
  try {
    sessionStorage.setItem("currentView", "showCarById");
    sessionStorage.setItem("currentCarId", id); // Spara bil-ID till sessionStorage
    const car = await moduleUserAPI.getCarById(id);

    const carsContainer = document.createElement("div");
    carsContainer.className = "cars-container";

    const imagePath = `/pics/cars/${car.name.toLowerCase()}-${car.model.toLowerCase()}.jpg`;
    const carCard = document.createElement("div");
    carCard.className = "car-card shadow-box";

    // Skapa kortets HTML-innehåll
    carCard.innerHTML = `
      <img 
        src="${imagePath}" 
        alt="${car.name}" 
        class="car-image" 
        onerror="this.src='/pics/cars/default.jpg'" /> <!-- Fallback-bild -->
      <div class="car-info">
        <h2>${car.name} ${car.model}</h2>
        <ul class="car-features">
          <li>${car.feature1}</li>
          <li>${car.feature2}</li>
          <li>${car.feature3}</li>
        </ul>
        <p class="car-price">${car.price} SEK / dag</p>
      
        <div class="form">
          <form class="form-item" id="booking-form">
            <label for="from_date">Datum från:</label>
            <input type="date" id="from_date" name="from_date" required>
            <label for="to_date">Datum till:</label>
            <input type="date" id="to_date" name="to_date" required>
            <label for="customer_id">Kund ID:</label>
            <input type="text" id="customer_id" name="customer_id" required>
            <button type="submit" id="bookCar" class="btn btn-positive">Boka</button>
          </form>
        </div>

      </div>
    `;

    // Lägg till bilkortet i containern
    carsContainer.appendChild(carCard);

    // Lägg till bilkortets container i DOM
    appContentEl.appendChild(carsContainer);
    // Hämta formuläret och knappen
    const bookingForm = document.getElementById("booking-form");
    const bookButton = carCard.querySelector("#bookCar");

    // Lägg till en submit-event för formuläret
    bookingForm.addEventListener("submit", (event) => {
      event.preventDefault(); // Förhindra standard formulärsändning

      const bookingData = {
        from_date: document.getElementById("from_date").value,
        to_date: document.getElementById("to_date").value,
        customerId: document.getElementById("customer_id").value,
        car_id: id,
      };

      if (bookingData.from_date >= bookingData.to_date) {
        alert("Kontrollera att Från-datum är tidigare än Till-datum.");
      } else {
        bookCar(bookingData); // Anropa funktionen för att boka bilen
      }
    });
  } catch (error) {
    console.error("Fel vid hämtning av bilen:", error);
    appContentEl.innerHTML =
      "<h2>Det uppstod ett fel vid hämtning av bilen.</h2>";
  }
}

/* FUNKTION FÖR ATT BOKA BIL */
function bookCar(carId) {
  console.log("Bokar bil med ID:", carId);
  // Lägg till nån logik här!
  moduleCarFunctionUser.bookCar(carId);
  /* alert(`Bilen med ID ${carId} har bokats!`); */
}
