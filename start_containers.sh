# Starts up Docker container for PostgreSQL, and runs db init script if DB is not initialized
docker run -e POSTGRES_USER=smartbrain -e POSTGRES_PASSWORD=smartbrain_pg_pw -e POSTGRES_DB=smartbrain -d -p 5433:5432 smartbrain_postgres

# Runs in interactive shell mode, exposing main port, debugging port, grabbing env variables from env file,
# and sets up volume mapping so code changes on here will reflect in the container
docker run -it -p 3001:3001 -p 9229:9229 --env-file .env -v $(pwd):/usr/src/app smartbrain_api