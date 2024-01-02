
FROM mongo:latest
WORKDIR /docker-entrypoint-initdb.d

COPY mongo-init.js .

VOLUME ["/data/db"]
EXPOSE 27017

CMD ["mongod", "--bind_ip", "77.222.43.158"]
