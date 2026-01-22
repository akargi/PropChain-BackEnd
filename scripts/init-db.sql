-- PropChain Database Initialization Script
-- This script sets up the initial database structure and extensions

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Create custom types
CREATE TYPE user_role AS ENUM ('ADMIN', 'USER', 'VERIFIED_USER', 'AGENT');
CREATE TYPE property_status AS ENUM ('DRAFT', 'PENDING', 'APPROVED', 'LISTED', 'SOLD', 'REMOVED');
CREATE TYPE transaction_status AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED');
CREATE TYPE transaction_type AS ENUM ('PURCHASE', 'TRANSFER', 'ESCROW', 'REFUND');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_properties_owner_id ON properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties USING GIN(to_tsvector('english', location));
CREATE INDEX IF NOT EXISTS idx_transactions_from_address ON transactions(from_address);
CREATE INDEX IF NOT EXISTS idx_transactions_to_address ON transactions(to_address);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);

-- Create full-text search configuration
CREATE TEXT SEARCH CONFIGURATION IF NOT EXISTS propchain_search (COPY = english);

-- Set up row-level security policies (optional, for multi-tenant scenarios)
-- ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_logs(table_name, operation, old_data, new_data, user_id, timestamp)
        VALUES(TG_TABLE_NAME, TG_OP, NULL, row_to_json(NEW), NULL, NOW());
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_logs(table_name, operation, old_data, new_data, user_id, timestamp)
        VALUES(TG_TABLE_NAME, TG_OP, row_to_json(OLD), row_to_json(NEW), NULL, NOW());
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_logs(table_name, operation, old_data, new_data, user_id, timestamp)
        VALUES(TG_TABLE_NAME, TG_OP, row_to_json(OLD), NULL, NULL, NOW());
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create notification function for real-time updates
CREATE OR REPLACE FUNCTION notify_property_change()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM pg_notify('property_changes', 
        json_build_object(
            'id', NEW.id,
            'status', NEW.status,
            'operation', TG_OP,
            'timestamp', NOW()
        )::text
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create function for property search
CREATE OR REPLACE FUNCTION search_properties(query_text TEXT)
RETURNS TABLE(
    id UUID,
    title VARCHAR,
    description TEXT,
    location VARCHAR,
    price DECIMAL,
    status property_status,
    similarity_score REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.title,
        p.description,
        p.location,
        p.price,
        p.status,
        ts_rank_cd(
            to_tsvector('propchain_search', COALESCE(p.title, '') || ' ' || COALESCE(p.description, '') || ' ' || COALESCE(p.location, '')),
            plainto_tsquery('propchain_search', query_text)
        ) as similarity_score
    FROM properties p
    WHERE 
        to_tsvector('propchain_search', COALESCE(p.title, '') || ' ' || COALESCE(p.description, '') || ' ' || COALESCE(p.location, '')) 
        @@ plainto_tsquery('propchain_search', query_text)
        AND p.status = 'APPROVED'
    ORDER BY similarity_score DESC;
END;
$$ LANGUAGE plpgsql;

-- Create function for blockchain transaction verification
CREATE OR REPLACE FUNCTION verify_blockchain_transaction(tx_hash VARCHAR)
RETURNS TABLE(
    verified BOOLEAN,
    block_number BIGINT,
    gas_used BIGINT,
    status VARCHAR
) AS $$
BEGIN
    -- This would typically call an external service or use a blockchain library
    -- For now, return a placeholder
    RETURN QUERY
    SELECT 
        false as verified,
        0::BIGINT as block_number,
        0::BIGINT as gas_used,
        'pending' as status;
END;
$$ LANGUAGE plpgsql;

-- Set up database statistics collection
CREATE OR REPLACE FUNCTION update_database_stats()
RETURNS VOID AS $$
BEGIN
    -- Update user statistics
    ANALYZE users;
    
    -- Update property statistics
    ANALYZE properties;
    
    -- Update transaction statistics
    ANALYZE transactions;
    
    -- Log statistics update
    INSERT INTO system_logs(log_level, message, context, timestamp)
    VALUES('INFO', 'Database statistics updated', 'maintenance', NOW());
END;
$$ LANGUAGE plpgsql;

-- Create scheduled job for statistics update (requires pg_cron extension)
-- SELECT cron.schedule('update-stats', '0 2 * * *', 'SELECT update_database_stats();');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;

-- Create initial admin user (optional - should be done through application)
-- INSERT INTO users (id, email, wallet_address, role, created_at, updated_at)
-- VALUES (
--     uuid_generate_v4(),
--     'admin@propchain.io',
--     '0x0000000000000000000000000000000000000000',
--     'ADMIN',
--     NOW(),
--     NOW()
-- );

-- Log database initialization
INSERT INTO system_logs(log_level, message, context, timestamp)
VALUES('INFO', 'Database initialized successfully', 'setup', NOW());

COMMIT;
