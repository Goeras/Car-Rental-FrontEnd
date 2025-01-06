const moduleUserAPI = await import("/js/api/apiUser.js");

export async function bookCar(bookingData) {
  console.log("Boka-knapp klickad för bil-ID:", bookingData.car_id);
  const car = await moduleUserAPI.getCarById(bookingData.car_id);

  const isAvailable = await availableDate(bookingData);

  const getCarDetails = (car) => {
    return car ? `${car.name} ${car.model}` : "Okänd bil";
  };

  const getBookingPrice = (car, fromDate, toDate) => {
    const days = Math.ceil(
      (new Date(toDate) - new Date(fromDate)) / (1000 * 60 * 60 * 24)
    );
    return car ? `${car.price * days} SEK` : "Okänt pris";
  };

  if (isAvailable) {
    console.log("Bilen är ledig för bokning");

    const booking = await moduleUserAPI.addNewBooking(bookingData);

    alert(
      `${getCarDetails(car)} har bokats! Pris: ${getBookingPrice(
        car,
        bookingData.from_date,
        bookingData.to_date
      )}`
    );
  } else {
    alert("Bilen är tyvärr inte ledig för bokning under dessa datum.");
  }

  async function availableDate(bookingData) {
    const carId = bookingData.car_id;
    const fromDate = new Date(bookingData.from_date);
    const toDate = new Date(bookingData.to_date);

    const allBookings = await moduleUserAPI.getAllOrders();

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

    console.log("isAvailable: " + isAvailable);
    return isAvailable; // Returnera true om bilen är ledig, annars false
  }
}
