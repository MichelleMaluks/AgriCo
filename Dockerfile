FROM php:8.4-apache

RUN a2enmod rewrite

RUN apt-get update && apt-get install -y \
    libpq-dev \
    zip \
    unzip \
    git \
    libonig-dev \
    libzip-dev

RUN docker-php-ext-install pdo pdo_pgsql mbstring fileinfo zip

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .

# Set Apache document root to Laravel's public folder
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public

RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf \
    && sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

RUN git config --global --add safe.directory /var/www/html

RUN composer install --no-dev --optimize-autoloader

EXPOSE 80
CMD ["apache2-foreground"]
