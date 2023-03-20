docker network create lyrics-network
docker build -t lyrics-api:1.0 .

docker run --name lyrics-db \
    -dp 3306:3306 \
    -e MYSQL_ROOT_PASSWORD=cisco123 \
    -v mysql:/var/lib/mysql \
    --network lyrics-network \
    mysql:8

docker run --name lyrics-api \
    --network lyrics-network \
    -p 80:80 \
    lyrics-api:1.0

