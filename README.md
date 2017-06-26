# NEURONE: oNlinE inqUiRy experimentatiON systEm

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](http://www.gnu.org/licenses/agpl-3.0) [![Build Status](https://travis-ci.com/dgacitua/neurone.svg?token=bybFYGq2vZ5sYMfosTqM&branch=master)](https://travis-ci.com/dgacitua/neurone)

Created by Daniel Gacitua

## Install Instructions

### Development

**NOTE:** A Linux development machine is highly recommended.

1. In your development machine: install Node.js 4.8.2+, MongoDB 3.4+, Solr 6.5+ and Meteor 1.4.4+
2. In Solr, create a core (or collection) called `neurone`
3. Clone this repository (or download as ZIP)
4. Open a terminal in NEURONE's source code directory, run `meteor npm install` and then run `./developmentDeploy.sh`
5. Edit any files you need, the will be live-reloaded in your local web browser
6. When you are done, just abort the terminal (i.e. `CTRL+C`)

### Production

**NOTE:** A Linux Virtual Private Server (VPS) or a Linux local machine with SSH access is needed to run this project in production mode.

#### Quick deploy (through Docker and Docker Compose)

1. In your production machine, install Docker (the following instructions are for Ubuntu Server):

        $ sudo apt-get update
        $ sudo apt-get install apt-transport-https ca-certificates curl software-properties-common unzip
        $ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
        $ sudo apt-key fingerprint 0EBFCD88
        $ sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
        $ sudo apt-get update
        $ sudo apt-get install docker-ce

2. Enable Docker for your current user (so you don't need `sudo` anymore):

        $ sudo usermod -aG docker $(whoami)
        $ logout

3. Install Docker Compose:

        $ sudo curl -L https://github.com/docker/compose/releases/download/1.13.0/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
        $ sudo chmod +x /usr/local/bin/docker-compose

4. Copy NEURONE's source code into a folder on your home (for this example, `neurone-master` will be assumed as your source code folder)

5. You can set some of the following Environment Variables on your production machine to customize deployment, although NEURONE can run perfectly with its default values (take note of those values whether you use the default ones or not):

    | Env Variable Name     | Default Value       | Description                                                |
    |-----------------------|---------------------|------------------------------------------------------------|
    | NEURONE_ASSET_PATH    | `~/neuroneAssets`   | NEURONE asset folder location in your production machine   |
    | NEURONE_MONGO_PATH    | `~/neuroneDatabase` | MongoDB raw data folder storage in your production machine |
    | NEURONE_HOST          | `localhost`         | IP or DNS domain where NEURONE is hosted                   |
    | NEURONE_ADMIN_DB_USER | `admin`             | MongoDB Admin username                                     |
    | NEURONE_ADMIN_DB_PASS | `neurone2017`       | MongoDB Admin password                                     |
    | NEURONE_DB            | `neurone`           | MongoDB database name                                      |
    | NEURONE_DB_USER       | `neurone`           | MongoDB database username                                  |
    | NEURONE_DB_PASS       | `neurone`           | MongoDB database password                                  |
    
    To override a default value through an environment variable, use the following command as an example:
    
        $ export NEURONE_HOST=123.45.67.89

6. Create your asset and raw data folder at the locations defined on Step 5, also copy your assets (example will assume `myAssets.zip` as source) to your NEURONE asset folder

        $ mkdir -p ~/neuroneAssets
        $ mkdir -p ~/neuroneDatabase
        $ unzip myAssets.zip -d ~/neuroneAssets

7. Run Docker Compose to deploy NEURONE:

        $ cd ~/neurone-master
        $ docker-compose build
        $ docker-compose up -d

    All required project dependencies will be downloaded automatically. Depending on internet connection, the build process could take between 15 and 30 minutes. To undeploy NEURONE, run the following commands:
    
        $ cd ~/neurone-master
        $ docker-compose down

8. You can access your NEURONE simulation instance through a web browser by entering your IP or DNS address or use the following ports to access and configure NEURONE when deployed:
 
    | Application | Port   | Description                                                                        |
    |-------------|--------|------------------------------------------------------------------------------------|
    | NEURONE     | `80`   | NEURONE Simulation Module (access through web browser)                             |
    | MongoDB     | `1313` | NEURONE Database Module (access through a MongoDB client)                          |
    | Solr        | `1314` | NEURONE Information Retrieval Module (access through web browser or REST requests) |

## Contact

In case you find a bug or have a suggestion, please send an Issue on this repo. Pull Requests are welcome.