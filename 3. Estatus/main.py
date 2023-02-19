import requests
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import time

# Sitio web a monitorear
URL = "https://isaac-bh.github.com/"


def send_mail(status_code, timestmp):
    # Esta parte debe de ser configurada por cada usuario.
    email_from = "ejemplo@mail.com"
    password = "CONTRASEÑA_SUPER_SECRETA123"
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    email_to = "destinatario@mail.com"

    # Datos del mail a enviar
    msg = MIMEMultipart()
    msg["Subject"] = str("Servicio " + URL + " innaccesible")
    msg["From"] = email_from
    msg["To"] = email_to
    body = f"""\
    <html>
    <body>
        <p>El servicio web {URL} responde con un código {status_code}<br>
        Fecha y hora de la detección del incidente: {timestmp.tm_mday}/{timestmp.tm_mon}/{timestmp.tm_year} -
        {timestmp.tm_hour}:{timestmp.tm_min}<br>
        Favor de arreglarlo a la brevedad posible</p>
        <img src="https://i.imgflip.com/2pg2s7.jpg" alt="Situación actual">
    </body>
    </html>
    """
    msg.attach(MIMEText(body, "html"))

    # Se inicia una conexión segura con el servidor SMTP, se inicia sesión, 
    # se envia el mail y se cierra la conexión.
    server = smtplib.SMTP(smtp_server, smtp_port)
    server.starttls()
    server.login(email_from, password)
    server.sendmail(email_from, email_to, msg.as_string())
    server.quit()


def main():
    # Petición HTTP, código entre 200 y 299 = Ok
    response = requests.get(URL)
    if not (response.status_code >= 200 and response.status_code <= 299):
        send_mail(response.status_code, time.localtime())

if __name__ == "__main__":
    main()
