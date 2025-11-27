-- Create databases for microservices
CREATE DATABASE atyourdoorstep_auth;
CREATE DATABASE atyourdoorstep_orders;

-- Connect to auth database and create extensions
\c atyourdoorstep_auth;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Connect to orders database and create extensions
\c atyourdoorstep_orders;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
