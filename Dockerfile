# Use PHP 8.4 with Apache
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

# Copy the entire project (including artisan)
COPY . .

# Fix Git safe directory warning
RUN git config --global --add safe.directory /var/www/html

# Install dependencies
RUN composer install --no-dev --optimize-autoloader

EXPOSE 80
CMD ["apache2-foreground"]
