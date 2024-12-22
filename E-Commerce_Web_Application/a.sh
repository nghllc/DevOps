docker build -t nginx .
docker run -d -p 1234:1234 --name nginx-container nginx
