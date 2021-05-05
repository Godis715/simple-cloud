username=$1
host=$2
port=$3
key_path=$4
filepath=$5
dest_filename=$6

cat $filepath | sudo ssh $username@$host -p $port -i $key_path "cat > /tmp/$dest_filename"
