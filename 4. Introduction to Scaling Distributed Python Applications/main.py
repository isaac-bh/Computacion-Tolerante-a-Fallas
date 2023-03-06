import threading
import time
from os import path


def monitoreo(paths):
    while True:
        for file in paths:
            reversed_path = 'reversed_' + file
            if path.exists(reversed_path):
                print(f"El archivo {reversed_path} existe, por lo que el hilo se ejecutó bien")
            else:
                print(f"El archivo {reversed_path} no existe, por lo que un hilo falló")

        time.sleep(3)


def invert_file(file_path: str, thread):
    try:
        file = open(file_path, 'r')
        lines = list(file)
        file.close()

        lines[-1] += '\n' 
        
        new_file = 'reversed_' + file_path
        file = open(new_file, 'w')
        for line in reversed(lines):
            file.write(line)

        file.close()
        time.sleep(5)
        print(f"Finalizado el {thread}")
    except:
        print(f"Algo fallo en el {thread}")


def main():
    hilos = []
    paths = ['hmlet.txt', 'quijote.txt']
    MAX_THREADS = len(paths)

    for i in range(MAX_THREADS):
        t = 'T' + str(i + 1)
        hilo = threading.Thread(target=invert_file, args=(paths[i], t))
        hilos.append(hilo)

    for hilo in hilos:
        hilo.start()

    monitor = threading.Thread(target=monitoreo, args=(paths,))
    monitor.daemon = True
    time.sleep(1)
    monitor.start()


if __name__ == '__main__':
    main()