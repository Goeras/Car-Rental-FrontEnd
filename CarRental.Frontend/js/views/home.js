const appContentEl = document.getElementById("app");

export function showStart() {
  // Spara till sessionStarage!
  sessionStorage.setItem("currentView", "showStart");

  appContentEl.innerHTML = "";

  const homePage = `
    <div class="content-start container">
  <h1 class="content-start-heading">Wigells Car Rental</h1>

  <div class="grid grid--2-cols shadow-box">
    <img class="content-img" src="pics/redCarCorner.jpg" alt="Picture of a red car" />
    <div>
      <h3 class="content-sub-heading text-center">Välkommen till Wigells!</h3>
      <p class="lorem">
        Hos oss hittar du ett brett utbud av moderna och välskötta bilar som passar alla ändamål. Oavsett om du behöver en liten och smidig bil för stadskörning eller en rymlig SUV för familjeresan.
      </p>
      <p class="lorem">
        Vi erbjuder alltid konkurrenskraftiga priser och är stolta över vår transparenta prispolicy.
      </p>
      <div class="list-box">
      <ul class="list-attributes">
        <li><ion-icon class="list-icon" name="checkmark-outline"></ion-icon><span>Enkel bokning online.</span></li>
        <li><ion-icon class="list-icon" name="checkmark-outline"></ion-icon><span>Inga dolda avgifter.</span></li>
        <li><ion-icon class="list-icon" name="checkmark-outline"></ion-icon><span>Flexibla hyresalternativ.</span></li>
      </ul>
      </div>
    </div>
  </div>

  <div class="grid grid--2-cols shadow-box">
    <div>
      <h3 class="content-sub-heading text-center">Varför välja Wigells?</h3>
      <p class="lorem">
        Vi på Wigells Car Rental förstår vikten av tillförlitlighet och bekvämlighet. Därför erbjuder vi försäkringar, fri vägassistans och valfria tillägg som GPS och barnstolar.
      </p>
      <p class="lorem">
        Våra hyrbilar inspekteras och underhålls regelbundet av vår professionella verkstadspersonal. Med vår smidiga onlinebokning och flexibla avbokningsregler kan du känna dig trygg i att din resa blir så stressfri som möjligt.
      </p>
      <div class="list-box">
      <ul class="list-attributes">
        <li><ion-icon class="list-icon" name="checkmark-outline"></ion-icon><span>Fri vägassistans.</span></li>
        <li><ion-icon class="list-icon" name="checkmark-outline"></ion-icon><span>Valfri utrustning.</span></li>
        <li><ion-icon class="list-icon" name="checkmark-outline"></ion-icon><span>Personlig service.</span></li>
      </ul>
      </div>
    </div>
    <img class="content-img" src="pics/blueCarCorner.jpg" alt="Picture of a blue car" />
  </div>
</div>
`;
  appContentEl.innerHTML = homePage;
}
