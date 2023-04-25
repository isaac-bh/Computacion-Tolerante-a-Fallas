# Kubernetes
## **Universidad de Guadalajara** - Centro Universitario de Ciencias Exactas e Ingenierias

### Este es un proyecto realizado para la materia de Computación Tolerante a Fallas - D06

**Alumno:** Benavides Hernandez Isaac Alain

---
## Introducción
Los servicios web una vez terminada la fase de desarrollo entran a la fase de despliegue y mantenimiento, se cree que esta etapa en el ciclo de la vida del software es más sencilla que el desarrollo, sin embargo, esto no siempre es así, para facilitar varias tareas como el despliegue y la recuperación ante errores se crearón herramientas que utilicen los contenedores a escala masiva para resolver estas problematicas. En esta practica se utilizará el orquestador de contenedores Kubernetes para desplegar un servicio web de manera sencilla.

---
## Preguntas
### ¿Qué es Kubernetes?
Kubernetes es una plataforma para administrar servicios basados en contenedores. Esta plataforma facilita la automatización y orquestación de la infraestructura de computo, de redes y el almacenamiento para adaptarse a las cargas de trabajo.

### ¿Qué es Ingress?
Ingress es un servicio integrado en Kubernetes que se utiliza para exponer servicios HTTP o HTTPS desde el exterior a servicios ubicados en nuestro Cluster. Se utiliza un archivo para definir la configuración. La diferencia de Ingress con un balanceador de carga es que por cada servicio que se ofrezca en un cluster se necesita un balanceador de carga y una IP, por lo que puede suponer un sobrecoste.

### ¿Qué es un LoadBalancer?
LoadBalancer es un servicio de Kubernetes que provee un balanceador de carga externo al cluster. Este servicio es una API que se sincroniza con el proveedor de servicios de computo en la nube para proveer el balanceador de carga y una IP pública para utilizar.

---
## Contenido

Para esta practica se desarrolló una aplicación web sencilla en Flask donde se obtienen los datos de un país a través de una API pública, se grafican estos datos y se muestran al usuario. El código es el siguiente:

~~~python
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
~~~

Se contenerizo esta aplicación para poderla desplegar usando Kubernetes, sin embargo, para hacer mas sencillo el despliegue, se subió la imagen directamente hacia Docker Hub (https://hub.docker.com/r/isaacbh/countries-app).

![Docker build](./img/1.png "Docker build")

Ahora, para desplegar el contenedor con Kubernetes, utilizare un servicio de computo en la nube, por 2 sencillas razones:

1. Es más sencillo desplegar estos servicios administrados que instalar el software en mi equipo.

2. Los orquestadores son herramientas muy utilizadas en computo en la nube, entonces me parece buena idea ganar algo de experiencia en este ambiente.

Uticilicé los servicios de Linode.
![Linode Kubernetes Dashboard](./img/4.png "Linode Kubernetes Dashboard")

Cuando creamos nuestro cluster, nos ofrecerá varias opciones para nuestros nodos, como somos humildes, elegiremos los nodos más baratos que podamos contratar.

![Linode Kubernetes Nodes Plans](./img/5.png "Linode Kubernetes Nodes Plans")

Una vez confirmada nuestra configuración, nos dara el estatus de nuestros nodos y nos proporcionará un archivo YAML con la configuración para acceder a nuestro nodo maestro de Kubernetes. Descargamos este archivo y lo agregamos al PATH de nuestra computadora, de esta manera kubectl tendrá todo lo necesario para trabajar.

![Configuración de kubectl](./img/6.png "Configuración de kubectl")

Ya que tenemos configurado kubectl para trabajar con nuestro ambiente en la nube, realizaremos nuestro despliegue utilizando un manifiesto que definiremos en un archivo YAML:

~~~yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: countries-app-deployment
  labels:
    app: countriesapp
spec:
  replicas: 4
  selector:
    matchLabels:
      app: countriesapp
  template:
    metadata:
      labels:
        app: countriesapp
    spec:
      containers:
      - name: countriesapp
        image: isaacbh/countries-app:1.0
        ports:
        - containerPort: 5000
~~~

Aplicando la configuración a nuestro cluster utilizando nuestro archivo YAML Kubernetes realizará el trabajo necesario.

![Despliegue con kubectl](./img/8.png "Despliegue con kubectl")

Una vez que se tiene listo nuestro despliegue solo falta una cosa para poder acceder a nuestra aplicación web, definir nuestro balanceador de carga para poder acceder a nuestros pods.

~~~yaml
apiVersion: v1
kind: Service
metadata:
  name: countries-service
  annotations:
    service.beta.kubernetes.io/linode-loadbalancer-throttle: "4"
  labels:
    app: countries-service
spec:
  type: LoadBalancer
  ports:
    - name: http
      port: 5000
      targetPort: 5000
  selector:
    app: countriesapp
  sessionAffinity: None
~~~

Aplicaremos la configuración definida en el archivo YAML y Kubernetes se encargará de crear nuestro servicio.

![Creación de Load Balancer](./img/9.png "Creación de Load Balancer")

Con esto configurado, ya podremos acceder a nuestra aplicación web a través de la dirección IP que nos muestra el servicio, claro, especificando el puerto 5000 y despues del diagonal el país del que queremos obtener la información.

http://45.79.60.88:5000/mexico

![Servicio desplegado](./img/10.png "Servicio desplegado")

---
## Conclusión
Para finalizar, Kubernetes nos permite tener desplegar, mantener y actualizar el servicio utilizando solo 1 comando, por lo que es, a mi opinion, la herramienta más util existente para el despliegue de las aplicaciones: la capacidad de desplegar una cantidad enorme de replicas de nuestro servicio con un solo comando lo hace imprescindible para equipos de IT, además de que este no es el unico beneficio que nos ofrece, la capacidad de recuperación ante fallos, distribución de carga entre pods, etc. 
