FROM php:8.1-fpm-buster
SHELL ["/bin/bash", "-oeux", "pipefail", "-c"]

ENV COMPOSER_ALLOW_SUPERUSER=1 \
    COMPOSER_HOME=/composer

COPY --from=composer:2.2 /usr/bin/composer /usr/bin/composer

RUN apt-get update && \
    apt-get -y install git unzip libzip-dev libicu-dev libonig-dev cron vim && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    docker-php-ext-install intl pdo_mysql zip bcmath

# RUN echo "* * * * * cd /app && /usr/local/bin/php artisan schedule:run >> /var/log/task.log 2>&1" >> /var/spool/cron/crontabs/root
# RUN service cron restart

# COPY ./php.ini /usr/local/etc/php/php.ini
ARG UID=1000
RUN useradd -m -u ${UID} h_kinjo
USER ${UID}

WORKDIR /app

