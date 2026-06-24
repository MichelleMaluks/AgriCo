# Base image with PHP and Apache
FROM php:8.2-apache

# Enable Apache rewrite (needed for Laravel routes)
RUN a2enmod rewrite

# Install system dependencies and PHP extensions
RUN apt-get update && apt-get install -y \
    libpq-dev \
    zip \
    unzip \
    git \
    libonig-dev \
    libzip-dev \
    && docker-php-ext-install pdo pdo_pgsql mbstring tokenizer fileinfo zip

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copy project files
COPY . /var/www/html

# Set working directory
WORKDIR /var/www/html

# Install Laravel dependencies
RUN composer install --no-dev --optimize-autoloader

# Expose port 80
EXPOSE 80

# Start Apache
CMD ["apache2-foreground"]
