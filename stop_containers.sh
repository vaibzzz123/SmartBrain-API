docker stop $(docker ps | grep smartbrain_api | awk '{print $1}')
docker stop $(docker ps | grep smartbrain_postgres | awk '{print $1}')