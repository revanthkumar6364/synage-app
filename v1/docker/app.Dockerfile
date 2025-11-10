# -------------------------------------------------------------
# Base Image: PHP 8.3 FPM (for Laravel 12)
# -------------------------------------------------------------
    FROM php:8.3-fpm

    # -------------------------------------------------------------
    # Install Required System Packages & PHP Extensions
    # -------------------------------------------------------------
    RUN apt-get update && apt-get install -y \
        git unzip pkg-config curl gnupg \
        libzip-dev \
        libpng-dev libjpeg-dev libfreetype6-dev \
        libxml2-dev \
        libicu-dev \
        libgmp-dev \
        libonig-dev \
     && docker-php-ext-configure gd --with-freetype --with-jpeg \
     && docker-php-ext-install \
          pdo_mysql \
          mbstring \
          exif \
          pcntl \
          bcmath \
          gd \
          zip \
          intl \
     && docker-php-ext-install opcache \
     && { \
        echo 'opcache.enable=1'; \
        echo 'opcache.enable_cli=1'; \
        echo 'opcache.validate_timestamps=${PHP_OPCACHE_VALIDATE_TIMESTAMPS:-1}'; \
        echo 'opcache.max_accelerated_files=20000'; \
        echo 'opcache.memory_consumption=256'; \
        echo 'opcache.interned_strings_buffer=16'; \
     } > /usr/local/etc/php/conf.d/opcache.ini \
     && rm -rf /var/lib/apt/lists/*

    # -------------------------------------------------------------
    # Install Node.js 20 + Latest npm (for Vite/Laravel Mix builds)
    # -------------------------------------------------------------
    RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
     && apt-get install -y nodejs \
     && npm install -g npm@latest

    # -------------------------------------------------------------
    # Copy Composer from Official Image
    # -------------------------------------------------------------
    COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

    # -------------------------------------------------------------
    # Set Working Directory
    # -------------------------------------------------------------
    WORKDIR /var/www/html

    # -------------------------------------------------------------
    # Default Command (PHP-FPM)
    # -------------------------------------------------------------
    CMD ["php-fpm"]
