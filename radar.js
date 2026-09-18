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
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({miasto: miasto})
        });

        const dane = await odpowiedz.json();

        if (dane.sukces) {
            const opcjeDaty = { weekday: 'long', month: 'long', day: 'numeric'};
            const dzisiejszaData = new Date().toLocaleDateString('pl-PL', opcjeDaty);
            const poleOpisu = document.getElementById("data-opis");
            if (poleOpisu) {

                poleOpisu.innerText = `${dzisiejszaData} | ${dane.opis}`;
            }
            wynikDiv.innerHTML = `
                <div id="radar-container" style="width: 80%; margin-top: 10px; border-radius: 20px; overflow: hidden;">
                    <iframe
                        width="100%"
                        height="450"
                        src="https://embed.windy.com/embed.html?type=map&location=coordinates&lat=${dane.lat}&lon=${dane.lon}&detailLat=${dane.lat}&detailLon=${dane.lon}&metricRain=mm&metricTemp=°C&metricWind=km/h&zoom=11&overlay=radar&product=radar&marker=true"
                    frameborder="0">
                     </iframe>
                </div>
            `;
        } else {
            wynikDiv.innerHTML = `<span id="wynikError">${dane.wiadomosc}</span>`;
        }
    } catch(error) {
        wynikDiv.innerHTML = "<p style='color:red; margin:5px; padding:5px; background-color:black;'> Błąd połączenia z serwerem!</p>";
    }
}

function goTo(sciezka){
    const params = new URLSearchParams(window.location.search);
    const wybraneMiasto = params.get("miasto");
    const wynikSpan= document.getElementById("miastoWynik");

    if(wybraneMiasto){
        window.location.href= `/${sciezka}?miasto=${wybraneMiasto}`;
    }else{
        window.location.href=`/${sciezka}`;
    }
}