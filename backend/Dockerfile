FROM php:8.3-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gnupg2 \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip

# Install Microsoft SQL Server Drivers
RUN curl -fsSL https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor -o /usr/share/keyrings/microsoft-prod.gpg \
    && curl -fsSL https://packages.microsoft.com/config/debian/12/prod.list | tee /etc/apt/sources.list.d/mssql-release.list \
    && apt-get update \
    && ACCEPT_EULA=Y apt-get install -y msodbcsql18 unixodbc-dev \
    && pecl install sqlsrv pdo_sqlsrv \
    && docker-php-ext-enable sqlsrv pdo_sqlsrv

# Set working directory
WORKDIR /var/www
COPY . .

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer


# Install system dependencies for SQL Server drivers
RUN apt-get update && apt-get install -y unixodbc-dev gnupg2 

# Install the PHP extensions
RUN pecl install sqlsrv pdo_sqlsrv \
    && docker-php-ext-enable sqlsrv pdo_sqlsrv

# Install dependencies for intl
RUN apt-get update && apt-get install -y libicu-dev

# Install the extension
RUN docker-php-ext-install intl    