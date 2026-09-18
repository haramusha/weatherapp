document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const wybraneMiasto = params.get("miasto");
    const wynikSpan = document.getElementById("miastoWynik");

    if (wybraneMiasto) {
        if (wynikSpan) {
            wynikSpan.innerText = wybraneMiasto.charAt(0).toUpperCase() + wybraneMiasto.slice(1);
            sprawdzPogode(wybraneMiasto);
        }
    } else {
        if (wynikSpan) wynikSpan.innerText = "Brak miasta";
    }
});

async function sprawdzPogode(miasto) {
    const wynikDiv = document.getElementById("wynik");
    wynikDiv.innerHTML = "<span> Pobieranie danych z serwera...</span>";

    try {
        const odpowiedz = await fetch("/api/pogoda", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ miasto: miasto })
        });

        const dane = await odpowiedz.json();

        if (dane.sukces) {
            const opcjeDaty = { weekday: 'long', month: 'long', day: 'numeric' };
            const dzisiejszaData = new Date().toLocaleDateString('pl-PL', opcjeDaty);
            const poleOpisu = document.getElementById("data-opis");

            if (poleOpisu) {
                poleOpisu.innerText = `${dzisiejszaData} | ${dane.opis}`;
            }

            if (dane.status_alertu === "niebezpieczenstwo") {
                wynikDiv.innerHTML = `
                    <div class="danger-alert">
                        <span style="font-size: 18px;"></span>
                        <img src="static/danger-alert.png" height="25px" width="25px">
                        <span>${dane.komunikat_alertu}</span>
                    </div>
                `;
            } else if (dane.status_alertu === "ostrzezenie") {
                wynikDiv.innerHTML = `
                    <div class="warning-alert">
                        <span style="font-size: 18px;"></span>
                        <img src="static/warning-alert.png" height="25px" width="25px">
                        <span>${dane.komunikat_alertu}</span>
                    </div>
                `;
            } else {

                wynikDiv.innerHTML = `
                    <div class="safe-alert">
                        <span style="font-size: 18px;">✅</span>
                        <span>Brak ostrzeżeń w danym mieście. Pogoda jest stabilna.</span>
                    </div>
                `;

            }
        } else {
            wynikDiv.innerHTML = `<span id="wynikError">${dane.wiadomosc}</span>`;
        }
    } catch (error) {
        wynikDiv.innerHTML = "<p style='color:red; margin:5px; padding:5px; background-color:black;'> Błąd połączenia z serwerem!</p>";
    }
}

function goTo(sciezka) {
    const params = new URLSearchParams(window.location.search);
    const wybraneMiasto = params.get("miasto");

    if (wybraneMiasto) {
        window.location.href = `/${sciezka}?miasto=${wybraneMiasto}`;
    } else {
        window.location.href = `/${sciezka}`;
    }
}
