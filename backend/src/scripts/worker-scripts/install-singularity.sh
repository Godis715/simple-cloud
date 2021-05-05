set -e

# install singularity
# https://sylabs.io/guides/3.0/user-guide/quick_start.html

sudo apt-get update

sudo apt-get install -y \
    wget \
    build-essential \
    libssl-dev \
    uuid-dev \
    libgpgme11-dev \
    squashfs-tools \
    git

# для Singularity нужна версия минимум 1.13
export VERSION=1.13 OS=linux ARCH=amd64
wget -nc https://dl.google.com/go/go$VERSION.$OS-$ARCH.tar.gz
sudo tar -C /usr/local -xzvf go$VERSION.$OS-$ARCH.tar.gz

echo $HOME
echo 'export GOPATH=${HOME}/go' >> $HOME/.bashrc
echo 'export PATH=/usr/local/go/bin:${PATH}:${GOPATH}/bin' >> $HOME/.bashrc
# эквивалентно source в bash
export GOPATH=${HOME}/go
export PATH=/usr/local/go/bin:${PATH}:${GOPATH}/bin

go get -u github.com/golang/dep/cmd/dep

# get singularity
mkdir -p $GOPATH/src/github.com
cd $GOPATH/src/github.com
# чтобы git clone не упал, если папка singularity уже есть
git clone https://github.com/sylabs/singularity.git || true
cd singularity
./mconfig
make -C builddir
sudo make -C builddir install

# без этого почему-то не работает singularity
sudo singularity config global --unset "bind path" /etc/localtime
