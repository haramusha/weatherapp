from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)
API_KEY = "69473c6f15ca343de57187928a61cbb2"


@app.route("/")
def strona_glowna():
    return render_template("index.html")


@app.route("/panel", methods=["GET"])
def strona_panel():
    return render_template("panel.html")


@app.route("/weather", methods=["GET"])
def weather():
    return render_template("weather.html")


@app.route("/radar", methods=["GET"])
def radar():
    return render_template("radar.html")


@app.route("/warnings", methods=["GET"])
def warnings():
    return render_template("warnings.html")


@app.route("/api/pogoda", methods=["POST"])
def pobierz_pogode_api():
    dane_js = request.json
    miasto = dane_js.get("miasto")

    url = f"https://api.openweathermap.org/data/2.5/weather?q={miasto}&appid={API_KEY}&units=metric&lang=pl"
    odpowiedz = requests.get(url)

    if odpowiedz.status_code == 200:
        dane = odpowiedz.json()
        wynik = {
            "sukces": True,
            "miasto": miasto.capitalize(),
            "temperatura": round(dane["main"]["temp"]),
            "opis": dane['weather'][0]['description'].capitalize(),
            "wilgotnosc": round(dane['main']['humidity']),
            "wiatr": round(dane['wind']['speed']),
            "lat": dane['coord']['lat'],
            "lon": dane['coord']['lon']
        }

        poziom = "bezpiecznie"
        komunikat = "Brak aktywnych ostrzeżeń. Pogoda jest bezpieczna."

        if wynik["wiatr"] > 70:
            poziom = "niebezpieczenstwo"
            komunikat = f"Ostrzeżenie przed silnym wiatrem w porywach do {wynik['wiatr']} km/h!"
        elif wynik["temperatura"] > 30:
            poziom = "niebezpieczenstwo"
            komunikat = "Ostrzeżenie o upałach! Unikaj słońca i pamiętaj o nawodnieniu."
        elif wynik["temperatura"] < 0:
            poziom = "ostrzezenie"
            komunikat = "Ostrzeżenie o silnych mrozach i możliwym oblodzeniu na drodze."
        elif "deszcz" in wynik["opis"].lower() or "burz" in wynik["opis"].lower():
            poziom = "ostrzezenie"
            komunikat = "Spodziewane trudne warunki atmosferyczne (opady/burze)."

        wynik["status_alertu"] = poziom
        wynik["komunikat_alertu"] = komunikat

        return jsonify(wynik)
    else:
        return jsonify({"sukces": False, "wiadomosc": "Nie znaleziono takiego miasta!"})


if __name__ == "__main__":
    app.run(debug=True)