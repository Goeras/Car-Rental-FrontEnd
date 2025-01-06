const moduleUserAPI = await import("/js/api/apiUser.js");

export async function showCustomer(id) {
  try {
    const customer = await moduleUserAPI.getUserById(id);
    const bookings = await moduleUserAPI.getOrdersByCustomerId(id);
    const allCars = await moduleUserAPI.getAllCars();

    const getCarDetails = (carId) => {
      const car = allCars.find((car) => car.id === carId);
      return car ? `${car.name}  ${car.model}` : "Okänd bil";
    };

    const getBookingPrice = (carId, fromDate, toDate) => {
      const car = allCars.find((car) => car.id === carId);
      const days = Math.ceil(
        (new Date(toDate) - new Date(fromDate)) / (1000 * 60 * 60 * 24)
      );
      return car ? `${car.price * days} SEK` : "Okänt pris";
    };

    if (customer) {
      return `
      <h2 class="text-center">Kund</h2>
        <table class="customers-table margin-bottom">
            <thead>
              <tr class="clickable">
                <th data-type="number">Kund ID</th>
                <th data-type="string">Förnamn</th>
                <th data-type="string">Efternamn</th>
                <th data-type="string">Användarnamn</th>
                <th data-type="string">Telefon</th>
                <th data-type="string">Email</th>
              </tr>
            </thead>
            <tbody>
                <tr>
                  <td>${customer.id}</td>
                  <td>${customer.firstName}</td>
                  <td>${customer.lastName}</td>
                  <td>${customer.customerName}</td>
                  <td>${customer.phone}</td>
                  <td>${customer.email}</td>
                </tr>
            </tbody>
          </table>

          <h2 class="text-center">Bokningar</h2>
        <table class="customers-table">
            <thead>
              <tr class="clickable">
                  <th data-type="number">Boknings ID</th>
                  <th data-type="string">Från</th>
                  <th data-type="string">Till</th>
                  <th data-type="string">Bil</th>
                  <th data-type="string">Pris</th>
              </tr>
            </thead>
            <tbody>
                ${bookings
                  .map(
                    (booking) => `
                  <tr>
                    <td>${booking.id}</td>
                    <td>${booking.from_date}</td>
                    <td>${booking.to_date}</td>
                    <td>${getCarDetails(booking.car_id)}</td>
                    <td>${getBookingPrice(
                      booking.car_id,
                      booking.from_date,
                      booking.to_date
                    )}</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
          </table>
        `;
    } else {
      // Om inga kunder returneras
      return `<h1>Inga kunder att visa</h1>`;
    }
  } catch (error) {
    console.error("Kunde inte hämta kund:", error);
    return `<h1>Ett fel uppstod när kunden hämtades.</h1>`;
  }
}
