/* REGISTER */

const appContentEl = document.getElementById("app");

export function newUser() {
  appContentEl.innerHTML = "";
  console.log("inne i register.js filen, newUser");

  const form = `
    <form class="form">
                <h3>Skapa ny användare</h3>
                <div class="form-item">
                  <label for="firstName">Förnamn</label>
                  <input
                    type="text"
                    id="firstName"
                    placeholder="Tomas"
                    required
                  />
                </div>
                <div class="form-item">
                  <label for="lastName">Efternamn</label>
                  <input
                    type="text"
                    id="lastName"
                    placeholder="Wigell"
                    required
                  />
                </div>
                <div class="form-item">
                  <label for="birthdate">Födelsedatum</label>
                  <input
                    type="text"
                    id="birthdate"
                    placeholder="åååå-mm-dd"
                    required
                  />
                </div>
                <div class="form-item">
                  <label for="birthdate">Användarnamn</label>
                  <input
                    type="text"
                    id="userName"
                    placeholder="Tompa"
                    required
                  />
                </div>
                <div class="form-item">
                  <label for="birthdate">Lösenord</label>
                  <input type="password" id="password1" required />
                </div>
                <div class="form-item">
                  <label for="birthdate">Upprepa lösenord</label>
                  <input type="password" id="password2" required />
                </div>
                <button type="submit" class="btn btn-positive btn-form">
                  Spara
                </button>
              </form>
`;
  appContentEl.innerHTML = form;
}
