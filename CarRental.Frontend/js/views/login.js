/* LOG IN */

const appContentEl = document.getElementById("app");

// funktion för att visa login-content.
export function login() {
  sessionStorage.setItem("currentView", "login");
  return new Promise((resolve, reject) => {
    appContentEl.innerHTML = "";
    console.log("inne i login.js");

    const table = `
      <form class="form">
        <h3>Logga in</h3>
        <div class="form-item">
          <label for="userName">Användarnamn</label>
          <input type="text" id="userName" placeholder="Tompa" required />
        </div>
        <div class="form-item">
          <label for="password">Lösenord</label>
          <input type="password" id="password1" required />
        </div>
        <button type="submit" class="btn btn-positive btn-form">GO!</button>
      </form>
    `;
    appContentEl.innerHTML = table;

    // Hämta formuläret
    const loginForm = appContentEl.querySelector("form");

    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault(); // Förhindra formulärskick

      const userName = document.getElementById("userName").value;
      const password = document.getElementById("password1").value;

      console.log("Användarnamn:", userName);
      console.log("Lösenord:", password);

      const user = await authenticateUser(userName, password);

      if (user) {
        console.log("login.js: Authenticated user:", user);
        const module = await import("./home.js");
        sessionStorage.setItem("loggedInUser", JSON.stringify(user));
        module.showStart();
        resolve(user); // Returnera användaren när inloggningen är lyckad
      } else {
        reject("Felaktigt användarnamn eller lösenord");
        alert("Felaktigt användarnamn eller lösenord");
      }
    });
  });
}

// Kontroll av username och password.
import { fetchUserFromApi } from "/js/api/apiLogin.js";

async function authenticateUser(userName, password) {
  try {
    // Anropa API:t för att autentisera användaren
    const user = await fetchUserFromApi(userName, password);
    user.password = password;
    if (user.username === "admin") {
      user.isAdmin = true;
      user.isUser = false;
    } else {
      user.isAdmin = false;
      user.isUser = true;
    }
    console.log("authenticateUser", user);
    return user; // Returnera användardata från backend
  } catch (error) {
    console.error("Autentisering misslyckades:", error);
    return null; // Returnera null om autentiseringen misslyckades
  }
}
