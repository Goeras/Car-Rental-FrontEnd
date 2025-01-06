Får duga som ett första javascript-projekt.

Stor förbättringspotential finns gällande bl.a strukturen samt att vissa funktioner kan göras mer dynamiska för att på så sätt inte behöva upprepra kod, tex när tabeller skapas. Där skulle man kunna bygga om till en återanvändbar “component” som tar objekt, rubrik etc som inparameter och helt skapar tabellerna ut efter det. Det är lite spaghettikod i denna version :-D

I ett verkligt scenario så skulle man nog heller inte spara en användares lösenord i sessionstorage då lösenordet syns i utvecklarverktyget, utan enbart hålla det i en variabel.

Då vi inte loggar in med en verklig användare utan endast med user user så får man här som inloggad hämta en kund baserat på ett id. man kommer alltså åt alla användare när man är inloggad.

Webbsidan är hyffsat responsiv för mindre skärmar inkl mobil-meny.

"DOMContentLoaded" används för att hålla reda på vilken view som är senast aktiv och laddar om den när man tex uppdaterar sidan. Aktuell view sparas i sessionstorage och hämtas därifrån inuti DOMContentLoaded-funktionen
