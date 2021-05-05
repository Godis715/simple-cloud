set -e
# Takes Dockerfile path and output folder, e.g. /usr/some-folder/Dockerfile /tmp/output
# Creates image.sif in output folder: /tmp/output/image.sif

image_uuid=$(uuidgen)
dockerfile_path=$1/Dockerfile
docker_output=$1/image.tar
singularity_output=$1/image.sif

docker build -t $image_uuid -f $dockerfile_path .
docker save $image_uuid -o $docker_output
singularity build --force $singularity_output docker-archive://$docker_output

docker image rm $image_uuid
# rm $docker_output
