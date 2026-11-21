-- Read-only role for the /admin page (it only SELECTs from Umami's tables).
-- Run once on the server, as the main Postgres user:
--   docker compose exec -T postgres psql -U "$POSTGRES_USER" -d umami \
--     -v reader_password="'<long-random-password>'" < deploy/sql/umami-reader.sql
-- Then set in .env:
--   UMAMI_READER_URL=postgres://p4f_umami_reader:<long-random-password>@postgres:5432/umami
-- and run ./deploy/deploy.sh again.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'p4f_umami_reader') THEN
    CREATE ROLE p4f_umami_reader LOGIN;
  END IF;
END
$$;

ALTER ROLE p4f_umami_reader WITH PASSWORD :reader_password;
GRANT CONNECT ON DATABASE umami TO p4f_umami_reader;
GRANT USAGE ON SCHEMA public TO p4f_umami_reader;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO p4f_umami_reader;
-- Tables Umami creates later (upgrades) are readable too
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO p4f_umami_reader;
