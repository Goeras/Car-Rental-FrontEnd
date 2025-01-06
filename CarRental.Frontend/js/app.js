// Sätt användardata i sessionStorage
function setLoggedInUser(user) {
  sessionStorage.setItem("loggedInUser", JSON.stringify(user));
}

// Hämta användardata från sessionStorage
function getLoggedInUser() {
  const user = sessionStorage.getItem("loggedInUser");
  return user ? JSON.parse(user) : null;
}

/* BUTTONS & LISTENERS */
const menuShowCarsEl = document.querySelectorAll(".show-cars");
const menuStartEl = document.querySelectorAll(".show-start");
const menuLogIn = document.querySelectorAll(".show-login");
const menuMyPages = document.querySelectorAll(".show-bookings");
const menuRegister = document.querySelectorAll(".show-register");

/* Cars All */
menuShowCarsEl.forEach((element) => {
  element.addEventListener("click", async (event) => {
    event.preventDefault(); // Förhindrar standardlänk-navigering
    const loggedInUser = getLoggedInUser();
    if (loggedInUser) {
      try {
        const module = await import("./views/cars.js");
        module.showAllCars(); // Anropa funktionen från cars.js
      } catch (error) {
        console.error("Kunde inte ladda cars.js", error);
      }
    } else {
      try {
        const module = await import("./views/login.js");
        const user = await module.login(); // Hämta användaren från login.js
        console.log("Inloggad användare från login.js:", user);

        if (user) {
          setLoggedInUser(user); // Sätt användardata i sessionStorage
          console.log("Inloggad användare:", user);
        }
      } catch (error) {
        console.error("Kunde inte ladda login.js", error);
      }
    }
  });
});

/* Home */
menuStartEl.forEach((element) => {
  element.addEventListener("click", async (event) => {
    event.preventDefault();
    try {
      const module = await import("./views/home.js");
      module.showStart();
      console.log("Tillbaks i app.js");
    } catch (error) {
      console.error("Kunde inte ladda home.js", error);
    }
  });
});

/* Register */
menuRegister.forEach((element) => {
  element.addEventListener("click", async (event) => {
    event.preventDefault();
    try {
      const module = await import("./views/register.js");
      module.newUser();
    } catch (error) {
      console.error("Kunde inte ladda register.js", error);
    }
  });
});

/* Login */
menuLogIn.forEach((element) => {
  element.addEventListener("click", async (event) => {
    event.preventDefault();
    try {
      const module = await import("./views/login.js");
      const user = await module.login(); // Hämta användaren från login.js
      console.log("Inloggad användare från login.js:", user);

      if (user) {
        setLoggedInUser(user); // Sätt användardata i sessionStorage
        console.log("Inloggad användare:", user);
      }
    } catch (error) {
      console.error("Kunde inte ladda login.js", error);
    }
  });
});

/* My Pages */
menuMyPages.forEach((element) => {
  element.addEventListener("click", async (event) => {
    event.preventDefault(); // Förhindrar standardlänk-navigering

    const loggedInUser = sessionStorage.getItem("loggedInUser");

    if (loggedInUser) {
      const user = JSON.parse(loggedInUser); // Parsar användarobjektet
      try {
        if (user.isAdmin) {
          const moduleAdmin = await import("./views/myPagesAdmin.js");
          console.log("Admin användare");
          moduleAdmin.showMyPagesAdmin(); // Visa admins vy
        } else {
          const moduleUser = await import("./views/myPagesUser.js");
          console.log("Vanlig användare");
          moduleUser.showMyPagesUser(); // Visa användarens vy
        }
      } catch (error) {
        console.error("Kunde inte ladda bookings.js", error);
      }
    } else {
      // Om användaren inte är inloggad, dirigera till inloggningssidan
      try {
        const module = await import("./views/login.js");
        const user = await module.login(); // Hämta användaren från login.js
        console.log("Inloggad användare från login.js:", user);

        if (user) {
          setLoggedInUser(user); // Sätt användardata i sessionStorage
          console.log("Inloggad användare:", user);
        }
      } catch (error) {
        console.error("Kunde inte ladda login.js", error);
      }
    }
  });
});

// Sticky navigation bar
const sectionContentEl = document.querySelector(".section-first");

const obs = new IntersectionObserver(
  function (entries) {
    const ent = entries[0];

    if (!ent.isIntersecting) {
      document.body.classList.add("sticky");
    }
    if (ent.isIntersecting) {
      document.body.classList.remove("sticky");
    }
  },
  {
    //inside the viewport
    root: null,
    threshold: 0,
    rootMargin: "-80px",
  }
);
obs.observe(sectionContentEl);

// Set current year to Copyright.
document.querySelector(".year").textContent = new Date().getFullYear();

// PAGE RELOAD
// Triggas när sidan laddas om, efter att HTML-dokumentet är inläst, men före dess att css, bilder etc hinner laddas.
window.addEventListener("DOMContentLoaded", async () => {
  try {
    console.log("DOMContentLoaded event triggat!");

    const currentView = sessionStorage.getItem("currentView");
    const currentCarId = sessionStorage.getItem("currentCarId");

    console.log("currentView från sessionStorage:", currentView);

    switch (currentView) {
      case "showStart":
        const moduleStart = await import("./views/home.js");
        moduleStart.showStart();
        break;

      case "showAllCars":
        const moduleCarsAll = await import("./views/cars.js");
        moduleCarsAll.showAllCars();
        break;

      case "showMyPagesUser":
        const moduleMyPagesUser = await import("./views/myPagesUser.js");
        moduleMyPagesUser.showMyPagesUser();
        break;

      case "showMyPagesAdmin":
        const moduleMyPagesAdmin = await import("./views/myPagesAdmin.js");
        moduleMyPagesAdmin.showMyPagesAdmin();
        break;

      case "showCarById":
        if (currentCarId) {
          const moduleCarsById = await import("./views/cars.js");
          moduleCarsById.showCarById(currentCarId);
        } else {
          console.error("Inget bil-ID hittades i sessionStorage.");
        }
        break;

      case "login":
        const moduleLogin = await import("./views/login.js");
        moduleLogin.login();
        break;

      // används inte längre
      /* case "showBookings":
        const moduleShowBooking = await import("./views/bookings.js");
        const loggedInUser = getLoggedInUser();
        if (loggedInUser) {
          if (loggedInUser.user) {
            console.log("Användare är en vanlig användare.");
            const moduleShowBooking = await import("./views/bookings.js");
            moduleShowBooking.showMyPagesUser();
          } else if (loggedInUser.admin) {
            console.log("Användare är en admin.");
            moduleShowBooking.showMyPagesAdmin();
          }
        } else {
          // Om användaren inte är inloggad
          console.log("Ingen användare inloggad.");
        }
        break; */

      default:
        console.log("Ingen specifik vy angiven, laddar startsidan...");
        const moduleDefault = await import("./views/home.js");
        moduleDefault.showStart();
        break;
    }
  } catch (error) {
    console.error("Ett fel inträffade vid laddning av vy:", error);
    const moduleDefault = await import("./views/home.js");
    moduleDefault.showStart();
  }
});

$(document).ready(function () {
  console.log("jQuery är redo att användas!");
});

// Make mobile navigation work
const btnNavEl = document.querySelector(".btn-mobile-nav");
const headerEL = document.querySelector(".header");

btnNavEl.addEventListener("click", function () {
  headerEL.classList.toggle("nav-open");
});
