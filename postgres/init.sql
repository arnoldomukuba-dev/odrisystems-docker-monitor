-- ODRISYSTEMS Dockerized Service Monitor - Database Initialization

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Initialize database tables default schemas if needed
SELECT 'ODRISYSTEMS Database Initialized' AS status;
