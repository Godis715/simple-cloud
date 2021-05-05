set -e

username=$1
host=$2
port=$3
key_path=$4

cd ./src/scripts/worker-scripts
tar -czvf - *.sh | \
sudo ssh $username@$host -p $port -i $key_path \
    "cd /tmp && \
    cat > scripts.tar.gz && \
    mkdir -p scripts && \
    tar -xzvf scripts.tar.gz -C scripts && \
    cd scripts && \
    find . -type f -name '*.sh' -exec chmod +x {} \\;"
cd ../../..
