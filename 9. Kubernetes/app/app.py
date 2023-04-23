from flask import Flask, render_template, request
import requests
import json


app = Flask(__name__)


@app.route('/<nombre_pais>')
def index(nombre_pais):
    url = 'https://restcountries.com/v3.1/name/'
    url_pais = url + nombre_pais
    response = requests.get(url_pais)
    data = json.loads(response.text)

    country = {
        'name': data[0]['name']['common'],
        'oficial_name': data[0]['name']['official'],
        'continent': data[0]['region'],
        'capital': data[0]['capital'][0],
        'population': data[0]['population'],
        'flag': data[0]['flags']['png']
    }


    return render_template('main.html', country=country)