FROM php:8.2-fpm-alpine

# Instalar las herramientas necesarias para compilar
RUN apk add --no-cache \
    postgresql-client \
    postgresql-libs \
    libpq \
    && apk add --virtual .build-deps \
    postgresql-dev \
    autoconf \
    g++ \
    make \
    && docker-php-ext-configure pdo_pgsql --with-pdo-pgsql \
    && docker-php-ext-install pdo pdo_pgsql \
    && apk del .build-deps

# Copiar configuración de PHP
COPY php.ini /usr/local/etc/php/php.ini

WORKDIR /var/www/html

EXPOSE 9000

CMD ["php-fpm"]
