async function sprawdzPogode(){
    const miasto = document.getElementById("miastoInput").value;
    const wynikDiv = document.getElementById("wynik");

    if(!miasto){

        wynikDiv.innerHTML = "<span style='color:orange;'> Wpisz nazwę miasta!</span>";
        return;
    }


    wynikDiv.innerHTML = "<span> Pobieranie danych z serwera...</span>";

    try{
        const odpowiedz = await fetch("/pogoda",{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({miasto: miasto})
        });


        const dane = await odpowiedz.json();

        if(dane.sukces){
            wynikDiv.innerHTML = `
                <span>Wyniki dla:</span>
                <h3 id="miastoWynik">${dane.miasto}</h3>
                <div id="sum-circles">
                    <div class="circle">
                        <p>${dane.temperatura}°C</h2>
                        <span>Temperatura</span>
                    </div>
                    <div class="circle">
                        <p>${dane.wilgotnosc}%</h2>
                        <span>Wilgotność</span>
                    </div>
                    <div class="circle">
                        <p>${dane.wiatr}km/h</h2>
                        <span>Wiatr</span>
                    </div>
                </div>
            `;
        } else {

            wynikDiv.innerHTML = `<span id="wynikError"> ${dane.wiadomosc} <span/>`;
        }
    } catch(error){

        wynikDiv.innerHTML = "<p style='color:red;margin:5px;padding:5px;background-color:black;'> Błąd połączenia z serwerem!</p>";
    }
}