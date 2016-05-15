#!/bin/bash
# AMMA - BDA
export REPO_DIR=/usr/share/datalab

# Stop all docker images
docker stop $(docker ps -a -q) > /dev/null 2>&1

#cd /usr/share/datalab; source /usr/share/datalab/tools/initenv.sh
export PYTHONDONTWRITEBYTECODE=1

# Add this tools directory to the path
export PATH=$PATH:$REPO_DIR/tools

# Add aliases
alias pylint='pylint --rcfile=$REPO_DIR/tools/pylint.rc'

PROJECT_ID=`gcloud -q config list --format yaml | grep project | awk -F" " '{print $2}'`
TAG=amma-bda
REPO=$PROJECT_ID
ACCESS=true

# Process arguments
while [[ $# > 1 ]]
do
key="$1"

case $key in
    -r|--repository)
    REPO="$2"
    shift # past argument
    ;;
    -t|--tag)
    TAG="$2"
    shift # past argument
    ;;
    --no-access)
    ACCESS=false
    shift # past argument with no value
    ;;
    *)
            # unknown option
    ;;
esac
shift # past argument or value
done

$REPO_DIR/sources/build.sh

cd $REPO_DIR/containers/datalab
$REPO_DIR/containers/datalab/build.sh
$REPO_DIR/containers/datalab/stage-gcloud.sh $REPO $TAG $ACCESS
#https://cloud-datalab-deploy.appspot.com?container=gcr.io/$PROJECT_ID/datalab:$USER_$TAG
#$REPO_DIR/containers/datalab/run.sh
