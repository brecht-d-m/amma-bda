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

BUILD=false
USED_ENV=false

# Process arguments
while [[ $# > 0 ]]
do
key="$1"

case $key in
    -b|--build)
    BUILD=true
    ;;
    -e|--environment)
    shift
    $REPO_DIR/set-env-vars.sh "local" "$@"
    USED_ENV=true
    break
    ;;
    *)
            # unknown option
    ;;
esac
shift # past argument or value
done

if [ "$BUILD" == true ] ; then
    $REPO_DIR/sources/build.sh
    cd $REPO_DIR/containers/datalab
    $REPO_DIR/containers/datalab/build.sh
else
    cd $REPO_DIR/containers/datalab
fi
$REPO_DIR/containers/datalab/run.sh

# Cleanup
if [ "$USED_ENV" == true ] ; then
    echo -n > "$REPO_DIR/containers/datalab/env_vars.txt"
fi
