
# FROM mongo:latest

# COPY mongo-init.sh /docker-entrypoint-initdb.d/mongo-init.sh

# VOLUME ["/data/db", "/var/log/mongodb"]
# EXPOSE 27017

# CMD ["mongod"]


# Используем официальный образ MongoDB как базовый образ
FROM mongo:latest

# Копируем файл конфигурации внутрь контейнера
COPY mongo.cfg /etc/mongo.cfg
COPY mongo-init.sh /docker-entrypoint-initdb.d/mongo-init.sh
VOLUME ["/data/db"]

# Запускаем MongoDB с указанием файла конфигурации
CMD ["mongod", "--config", "/etc/mongo.cfg"]


# /mongo/data/db
# /mongo/logs
