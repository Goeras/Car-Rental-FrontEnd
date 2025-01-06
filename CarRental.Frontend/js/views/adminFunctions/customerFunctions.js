const moduleAdmin = await import("/js/api/apiAdmin.js");

/* const appContentEl = document.getElementById("adminContent"); */

/* GET ALL CUSTOMERS */
export async function showAllCustomers() {
  try {
    // Hämta kunder från backend via moduleAdmin
    const customers = await moduleAdmin.getAllCustomers();

    // Kontrollera om kunder returnerades
    if (customers && customers.length > 0) {
      // Bygg tabellen
      return `
          <h2 class="text-center">Alla Kunder</h2>
          <table class="customers-table">
            <thead>
              <tr class="clickable">
                <th data-type="none">Välj</th>
                <th data-type="number">ID</th>
                <th data-type="string">Förnamn</th>
                <th data-type="string">Efternamn</th>
                <th data-type="string">Användarnamn</th>
                <th data-type="string">Telefon</th>
                <th data-type="string">Email</th>
                <th data-type="number">Antal Bokningar</th>
              </tr>
            </thead>
            <tbody>
              ${customers
                .map(
                  (customer) => `
                <tr>
                <td><input type="checkbox" class="delete-checkbox" value="${customer.id}"></td>
                  <td>${customer.id}</td>
                  <td>${customer.firstName}</td>
                  <td>${customer.lastName}</td>
                  <td>${customer.customerName}</td>
                  <td>${customer.phone}</td>
                  <td>${customer.email}</td>
                  <td>${customer.noOfOrders}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          <button id="updateSelectedCustomer" class="btn btn-neutral">Uppdatera kund</button>
          <button id="deleteSelectedCustomers" class="btn btn-negative">Radera Valda Kunder</button>
        `;
    } else {
      // Om inga kunder returneras
      return `<h1>Inga kunder att visa</h1>`;
    }
  } catch (error) {
    console.error("Kunde inte hämta kunder:", error);
    return `<h1>Ett fel uppstod när kunder hämtades.</h1>`;
  }
}

// Delete Handle
export async function handleDeleteSelectedCustomers() {
  const checkboxes = document.querySelectorAll(".delete-checkbox:checked"); // Hämta alla valda checkboxar
  const selectedIds = Array.from(checkboxes).map((checkbox) => checkbox.value); // Hämta ID:n från de valda checkboxarna

  if (selectedIds.length > 0) {
    try {
      // Anropa API för att ta bort varje vald kund
      for (const id of selectedIds) {
        await moduleAdmin.deleteCustomer(id);
      }
      alert("De valda kunderna har raderats.");
      // Gör om proceduren att ladda inna alla kunder.
      const moduleMyPagesAdmin = await import("/js/views/myPagesAdmin.js");
      moduleMyPagesAdmin.renderAdminContent("viewAllCustomers");
    } catch (error) {
      console.error("Kunde inte radera kunder:", error);
      alert("Ett fel uppstod när kunder skulle raderas.");
    }
  } else {
    alert("Vänligen välj minst en kund att ta bort.");
  }
}

//Update Handle
export async function handleUpdateSelectedCustomers() {
  const selectedCustomers = Array.from(
    document.querySelectorAll(".delete-checkbox:checked")
  ).map((checkbox) => checkbox.value);

  // Kontrollera om mer än en kund är vald
  if (selectedCustomers.length !== 1) {
    alert("Endast ett val är giltigt. Vänligen välj en kund att uppdatera.");
    const moduleMyPagesAdmin = await import("/js/views/myPagesAdmin.js");
    moduleMyPagesAdmin.renderAdminContent("viewAllCustomers");
    return;
  }

  console.log("Valda kund-ID:n:", selectedCustomers); // Debugging

  // Här kan du skicka förfrågan till backend för att uppdatera de valda kunderna
  const customer = await moduleAdmin.getCustomerById(selectedCustomers);
  console.log("Customer från API:", customer); // Debugging
  return updateCustomerForm(customer);
}

export async function updateCustomers(customer) {
  // Här gör du en API-anrop för att uppdatera de valda kunderna
  // Till exempel kan du anropa en funktion som sköter API-anropet
  console.log("Uppdaterar följande kunder:", customer);
  const addedCustomer = await moduleAdmin.updateCustomer(customer);

  // Efter uppdatering, visa ett meddelande eller ladda om innehållet
  alert(`Kund med Id ${customer.id} har uppdaterats.`);
  const moduleMyPagesAdmin = await import("/js/views/myPagesAdmin.js");
  moduleMyPagesAdmin.renderAdminContent("viewAllCustomers");
}

/* Update customer form */
export function updateCustomerForm(selectedCustomer) {
  return `
        <h1>Uppdatera kund</h1>
    <form class="form" id="update-customer-form">
    <div class="form-item">
        <label for="customerId">Kund ID:</label>
        <input type="text" id="customerId" name="customerId" value="${selectedCustomer.id}" readonly>
      </div>
      <div class="form-item">
        <label for="firstName">Förnamn:</label>
        <input type="text" id="firstName" name="firstName" value="${selectedCustomer.firstName}" required>
      </div>
      <div class="form-item">
        <label for="lastName">Efternamn:</label>
        <input type="text" id="lastName" name="lastName" value="${selectedCustomer.lastName}" required>
      </div>
      <div class="form-item">
        <label for="customerName">Användarnamn:</label>
        <input type="text" id="customerName" name="customerName" value="${selectedCustomer.customerName}" required>
      </div>
      <div class="form-item">
        <label for="phone">Telefon:</label>
        <input type="text" id="phone" name="phone" value="${selectedCustomer.phone}" required>
      </div>
      <div class="form-item">
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" value="${selectedCustomer.email}" required>
      </div>
      <div class="form-item">
        <label for="password">Lösenord:</label>
        <input type="password" id="password" name="password" value="${selectedCustomer.password}" required>
      </div>
      <button type="submit" class="btn btn-positive" id="updateCustomer">Uppdatera kund</button>
    </form>
  `;
}

/* ADD NEW CUSTOMER */
export function addCustomerForm() {
  return `
        <h3>Lägg till en ny kund</h3>
        <form class="form" id="add-customer-form">
        <div class="form-item">
          <label for="firstName">Förnamn:</label>
          <input type="text" id="firstName" name="firstName" required>
        </div>
        <div class="form-item">
          <label for="lastName">Efternamn:</label>
          <input type="text" id="lastName" name="lastName" required>
        </div>
        <div class="form-item">
          <label for="customerName">Användarnamn:</label>
          <input type="text" id="customerName" name="customerName" required>
        </div>
        <div class="form-item">
          <label for="phone">Telefon:</label>
          <input type="text" id="phone" name="phone" required>
        </div>
        <div class="form-item">
          <label for="email">Email:</label>
          <input type="email" id="email" name="email" placeholder="j.rotten@rocknroll.com" required>
        </div>
        <div class="form-item">
          <label for="password">Lösenord:</label>
          <input type="password" id="password" name="password" required>
        </div>
        <div class="form-item">
          <label for="password2">Upprepa Lösenord:</label>
          <input type="password" id="password2" name="password2" required>
        </div>
        <button type="submit" class="btn btn-positive">Lägg till kund</button>
      </form>
  `;
}

export async function handleAddCustomerForm() {
  const form = document.getElementById("add-customer-form");
  console.log("handleAddCustomerForm..");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const customerData = {
      firstName: form.firstName.value,
      lastName: form.lastName.value,
      customerName: form.customerName.value,
      phone: form.phone.value,
      email: form.email.value,
      password: form.password.value,
      password2: form.password2.value,
    };

    try {
      if (!passwordMatcher(customerData.password, customerData.password2)) {
        alert("Lösenorden matchar inte. Försök igen.");
        return; // Stoppa om lösenorden inte matchar
      }
      // Anropar API-funktionen för att lägga till kunden
      const addedCustomer = await moduleAdmin.addNewCustomer(customerData);

      // Om det gick bra
      alert("Kunden har lagts till!");
      form.reset(); // Rensa formuläret
      console.log("Ny kund tillagd:", addedCustomer); // Visa den nya kunden i konsolen
    } catch (error) {
      // Om något gick fel
      console.error("Kunde inte lägga till kunden:", error);
      alert("Det gick inte att lägga till kunden. Försök igen.");
    }
  });
}

export function passwordMatcher(password1, password2) {
  return password1 === password2;
}
