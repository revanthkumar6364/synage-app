# Base image with PHP 8.3 FPM (Debian)
FROM php:8.3-fpm

# Install required libraries for PHP extensions
# NOTE: libonig-dev is needed for mbstring's regex support (oniguruma)
RUN apt-get update && apt-get install -y \
    git unzip pkg-config \
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

# Composer (multi-arch)
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

