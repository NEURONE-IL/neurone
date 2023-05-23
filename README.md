# NEURONE: oNlinE inqUiRy experimentatiON systEm

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)

Created by Daniel Gacitua

## Description

NEURONE (_oNlinE inqUiRy experimentatiON systEm_) is a software platform for simulating an isolated web searching environment and collecting usage information from registered users using the platform. The collected data can be used for building profiles or patterns of user navigation behaviors related to its online inquiry skills.

Some of the statistics that are captured (for each user) with NEURONE are: Login attempts, visited pages, relevant pages for the user (bookmarks), relevant text fragments for the user (snippets), questionnaire responses, task synthesis, mouse movements, click positions and keystrokes.

The web search engine shows only results from a local (thus limited) web page dataset, removing all links. These documents can be customized by the researcher, providing a customized flow of tasks for its simulation.

## User Manuals

All NEURONE functionality is described in these manuals:

- NEURONE's Researcher Manual (Explains the simulation aspects, asset generation, study flow building and final data parsing)
- NEURONE's Sysadmin Manual (Describes installation steps in order to deploy NEURONE in a server)
- NEURONE's Developer Manual (General notes for developing new extensions for NEURONE)

Manuals can be downloaded on the "Releases" section of this repository.

## Install Instructions

### Development

**NOTE:** A Linux development machine is highly recommended.

1. In your development machine: Install Meteor 1.6+ and Solr 6.5+ (see instructions below)
2. In Solr, create a core (or collection) called `neurone`
3. Clone this repository (or download as ZIP)
4. Open a terminal in NEURONE's source code directory, run `meteor npm install` (this is needed only once)
5. Now run `meteor npm start`. Edit any files you need, they will be live-reloaded in your local web browser
6. When you are done, just abort the terminal (i.e. `CTRL+C`)

#### Installing Meteor for development

Run the following command to install Meteor on Linux distributions:

    $ curl https://install.meteor.com/ | sh

#### Installing Solr for development

1. Solr requires Java 8 JDK or greater to run. Run the following commands to install Solr on Linux distributions:

        $ cd /tmp
        $ wget https://archive.apache.org/dist/lucene/solr/8.4.1/solr-8.4.1.tgz
        $ tar xzf solr-8.4.1.tgz solr-8.4.1/bin/install_solr_service.sh --strip-components=2
        $ sudo bash ./install_solr_service.sh solr-8.4.1.tgz

2. Create a new core (collection) in Solr for NEURONE:

        $ sudo su - solr -c "/opt/solr/bin/solr create -c neurone -n data_driven_schema_configs"

### Production

**NOTE:** A Linux Virtual Private Server (VPS) or a Linux local machine with SSH access is needed to run this project in production mode.

#### Quick deploy (through Docker and Docker Compose)

The following instructions are for Ubuntu Server, adapt them if another distribution is used:

1. Install required dependencies for Docker

        $ sudo apt-get update
        $ sudo apt-get install ca-certificates curl gnupg lsb-release

2. Add Docker's GPG key

        $ sudo mkdir -p /etc/apt/keyrings
        $ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg 

3. Set up Docker's repository

        $ echo \
          "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
          $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

4. Install Docker and Docker Compose

        $ sudo apt-get update
        $ sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin

5. Enable using Docker for current user (without requiring `sudo`):

        $ sudo usermod -aG docker $(whoami)
        $ logout

6. Copy NEURONE's source code into a folder on your home (for this example, `neurone-master` will be assumed as your source code folder)

7. You can set some of the following Environment Variables on your production machine to customize deployment, although NEURONE can run perfectly with its default values (take note of those values whether you use the default ones or not):

    | Env Variable Name       | Default Value          | Description                                                      |
    |-------------------------|------------------------|------------------------------------------------------------------|
    | `NEURONE_ASSET_PATH`    | `~/neuroneAssets`      | NEURONE asset folder location in your production machine         |
    | `NEURONE_MONGO_PATH`    | `~/neuroneDatabase`    | MongoDB raw data folder storage in your production machine       |
    | `NEURONE_HOST`          | `localhost`            | IP or DNS domain where NEURONE is hosted                         |
    | `NEURONE_ADMIN_DB_USER` | `admin`                | MongoDB Admin username                                           |
    | `NEURONE_ADMIN_DB_PASS` | `neurone2017`          | MongoDB Admin password                                           |
    | `NEURONE_DB`            | `neurone`              | MongoDB database name                                            |
    | `NEURONE_DB_USER`       | `neurone`              | MongoDB database username                                        |
    | `NEURONE_DB_PASS`       | `neurone`              | MongoDB database password                                        |
    | `MAPTILER_KEY`          | `XNctrGMVMOj0xErblNkx` | Maptiler API key (get one for free on https://www.maptiler.com/) |
    
    To override a default value through an environment variable, use the following command as an example:
    
        $ export NEURONE_HOST=123.45.67.89

8. Create your asset and raw data folder at the locations defined on Step 5, also copy your assets (example will assume `myAssets.zip` as source) to your NEURONE asset folder

        $ mkdir -p ~/neuroneAssets
        $ mkdir -p ~/neuroneDatabase
        $ unzip myAssets.zip -d ~/neuroneAssets

9. Run bundled scripts for building and deploying NEURONE:

        $ cd ~/neurone-master
        $ ./neurone-build.sh
        $ ./neurone-start.sh

    All required project dependencies will be downloaded automatically. Depending on internet connection, the build process could take between 15 and 30 minutes. To undeploy NEURONE, run the following commands:
    
        $ cd ~/neurone-master
        $ ./neurone-stop.sh

10. You can access your NEURONE simulation instance through a web browser by entering your IP or DNS address or use the following ports to access and configure NEURONE when deployed:
 
    | Application | Port   | Description                                                                        |
    |-------------|--------|------------------------------------------------------------------------------------|
    | NEURONE     | `80`   | NEURONE Simulation Module (access through web browser)                             |
    | MongoDB     | `1313` | NEURONE Database Module (access through a MongoDB client)                          |
    | Solr        | `1314` | NEURONE Information Retrieval Module (access through web browser or REST requests) |

#### Custom deploy (through Node.js)

Check NEURONE's Sysadmin Manual for complete instructions for a custom deploy using Node.js, Nginx and PM2.

## Contact

In case you find a bug or have a suggestion, please send an Issue on this repo. Pull Requests are welcome.

## License

NEURONE's Source Code is released under the GNU Affero General Public License (Version 3), meaning that:

- NEURONE is free to use, analyze, distribute and modify by anyone
- In case of using a modified version of NEURONE, all changes must be released under the same license and must be clearly stated
- The NEURONE Development Team is not responsible for any problems or damages generated by the use of this software (or its derivated forms)

In case of using NEURONE as part of a scientific publication, you must acknowledge the NEURONE Development Team by adding the following text (or a variation of it) in your published results:

*"This study uses the NEURONE Platform (developed in the context of the iFuCo Project funded by the Academy of Finland and CONICYT, Chile) as part of the research tools"*

And also referencing the following publications:

- González‐Ibáñez, R., Gacitúa, D., Sormunen, E., & Kiili, C. (2017). NEURONE: oNlinE inqUiRy experimentatiON systEm. Proceedings of the Association for Information Science and Technology, 54(1), 687-689.
- Sormunen, E., González-Ibáñez, R., Kiili, C., Leppänen, P. H., Mikkilä-Erdmann, M., Erdmann, N., & Escobar-Macaya, M. (2017, September). A Performance-based Test for Assessing Students’ Online Inquiry Competences in Schools. In European Conference on Information Literacy (pp. 673-682). Springer, Cham.
