from flask import Flask, render_template, request, jsonify
import requests
app = Flask(__name__)
API_KEY = "69473c6f15ca343de57187928a61cbb2"

@app.route("/")
def strona_glowna():
    return render_template("weather.html")

@app.route("/pogoda", methods=["POST"])
def pobierz_pogode_api():
    dane_js = request.json
    miasto = dane_js.get("miasto")

    url =f"https://api.openweathermap.org/data/2.5/weather?q={miasto}&appid={API_KEY}&units=metric&lang=pl"
    odpowiedz = requests.get(url)

    if odpowiedz.status_code == 200:
        dane = odpowiedz.json()

        wynik = {
            "sukces": True,
            "miasto": miasto.capitalize(),
            "temperatura": dane["main"]["temp"],
            "opis": dane['weather'][0]['description'].capitalize(),
            "wilgotnosc": dane['main']['humidity'],
            "wiatr": dane['wind']['speed']
        }
        return jsonify(wynik)

    else:
        return jsonify({"sukces": False, "wiadomosc": "Nie znaleziono takiego miasta!"})

if __name__ == "__main__":
    app.run(debug=True)
    