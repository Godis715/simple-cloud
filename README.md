# Simple Cloud

Application was developed within the Grid&Cloud technology course by a student of AMCP Faculty of SPbU

## Description

Simple Cloud is a web-based application for running Docker-defined tasks on remote nodes. Application provides functionality for defining clusters (ony for admin) and jobs.

## How it works?

![g c-diagram](https://user-images.githubusercontent.com/33070242/117547955-02b66900-b03b-11eb-927b-3657cff73510.png)

Users can upload their jobs as Dockerfiles and choosing cluster, on which this task should be executed.

Docker-defined tasks are built on the main host and converted to Singularity images. This Singularity images are transferred to worker-nodes via ssh as files and further executed there.

## Installation

### Requirements

Firstly, ensure that main host has some dependencies installed:
1. Docker
2. Singularity
3. Node.js
4. NPM, NPX

### Deployment

Backend:
1. Clone this repository to the main host
2. Go to `backend` folder
3. Run command for dependencies installation:
   ```sh
   npm install
   ```
4. Ensure that Docker daemon is running
5. Set env variables:
   ```
   SECRET_KEY=<any random string>
   SSH_PRIVATE_KEY=<path to your ssh private key>
   ORIGIN=http://localhost:3000
   ```
6. Run backend as root (this is neccessary for accessing docker):
   ```sh
    sudo npx ts-node src/index.ts
   ```
7. Create users (with env variables):
   ```sh
    npx ts-node src/utils/createUser.ts <username> <password> <options>
   ```
   Use `--admin` flag for administrator account

Frontend:
1. Go to `frontend` folder
2. Run command for dependencies installation:
   ```sh
   npm install
   ```
3.  Run frontend application (development mode):
    ```sh
    npm start
    ```

Now you can visit `localhost:3000`

### Usage

When attaching node to clusters, ensure that this node allows main host to establish ssh connection using private-public key approach. Also currently application allows to attach nodes only with installed `apt` package manager.
