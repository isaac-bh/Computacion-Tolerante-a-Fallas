from airflow.decorators import dag, task
import requests
from bs4 import BeautifulSoup
from datetime import date
import pendulum


@dag(
    schedule=None,
    start_date=pendulum.datetime(2023, 3, 12, tz="UTC"),
    tags=["webtask"],
)
def steam_deck_dollar_price():
    @task()
    def extract():
        url = 'https://www.banxico.org.mx/tipcamb/tipCamMIAction.do'
        response = requests.get(url)

        soup = BeautifulSoup(response.content, 'html.parser')
        renglon = soup.find('tr', {'class': 'renglonNon'})
        tds = renglon.find_all('td')

        return float(tds[-1].text.strip())
    

    @task()
    def transform(dolar):
        # Precio de la Steam Deck xd
        steam_deck = 399.00
        return dolar * steam_deck
    

    @task()
    def load(steam_deck_mxn, dolar, file):
        hoy = date.today()
        fecha_formateada = hoy.strftime("%d/%m/%Y")
        msg = str(fecha_formateada) + ' - Dolar a ' + str(dolar) + 'MXN, total de ' + str(steam_deck_mxn) + 'MXN por una Steam Deck.\n'
        with open(file, 'a') as f:
            f.write(msg)

        return msg

    
    dolar = extract()
    steam_deck_mxn = transform(dolar)
    result = load(steam_deck_mxn, dolar, 'track.txt')
    print(result)


steam_deck_dollar_price()
