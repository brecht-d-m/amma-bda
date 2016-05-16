#!/bin/bash
# AMMA - BDA
export REPO_DIR=/usr/share/datalab

# Stop all docker images
echo "Stopping existing docker images..."
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
BUILD=false
ACCESS=true
USED_ENV=false

# Process arguments
while [[ $# > 0 ]]
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
    -e|--environment)
    shift
    $REPO_DIR/set-env-vars.sh "remote" "$@"
    USED_ENV=true
    break
    ;;
    -b|--build)
    BUILD=true
    ;;
    --no-access)
    ACCESS=false
    ;;
    *)
            # unknown option
    ;;
esac
shift # past argument or value
done

if [ "$BUILD" == true ] ; then
   if [ "$ACCESS" == true ] ; then
       $REPO_DIR/push-to-gcloud.sh --repository "$REPO" --tag "$TAG"
   else
       $REPO_DIR/push-to-gcloud.sh --repository "$REPO" --tag "$TAG" --no-access
   fi
fi

DOCKER_IMAGE="gcr.io/${REPO}/datalab:${TAG}"
echo "Docker image: $DOCKER_IMAGE"

cat $REPO_DIR/deploy/app.yaml > $REPO_DIR/deploy/custom_app.yaml
cat $REPO_DIR/deploy/env_vars.txt >> $REPO_DIR/deploy/custom_app.yaml
gcloud preview app deploy $REPO_DIR/deploy/custom_app.yaml --image-url $DOCKER_IMAGE --project $PROJECT_ID --version amma-bda --quiet

# Cleanup
rm $REPO_DIR/deploy/custom_app.yaml
if [ "$USED_ENV" == true ] ; then
    echo -n > "$REPO_DIR/containers/datalab/env_vars.txt"
fi
