# Use PHP 8.4 with Apache
FROM php:8.4-apache

# Enable Apache rewrite (needed for Laravel routes)
RUN a2enmod rewrite

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    zip \
    unzip \
    git \
    libonig-dev \
    libzip-dev

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_pgsql mbstring fileinfo zip

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copy project files
COPY . /var/www/html

# Set working directory
WORKDIR /var/www/html

# Fix Git safe directory warning
RUN git config --global --add safe.directory /var/www/html

# Install Laravel dependencies
RUN composer install --no-dev --optimize-autoloader

# Expose port 80
EXPOSE 80

# Start Apache
CMD ["apache2-foreground"]
