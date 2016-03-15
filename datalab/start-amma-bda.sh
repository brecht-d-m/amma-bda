#!/bin/sh
# AMMA - BDA
REPO_DIR=/usr/share/datalab

# Stop all docker images
docker stop $(docker ps -a -q) > /dev/null 2>&1

#cd /usr/share/datalab; source /usr/share/datalab/tools/initenv.sh
export PYTHONDONTWRITEBYTECODE=1

# Add this tools directory to the path
export PATH=$PATH:$REPO_DIR/tools

# Add aliases
alias pylint='pylint --rcfile=$REPO_DIR/tools/pylint.rc'


/usr/share/datalab/sources/build.sh

cd /usr/share/datalab/containers/datalab
/usr/share/datalab/containers/datalab/build.sh
/usr/share/datalab/containers/datalab/run.sh
