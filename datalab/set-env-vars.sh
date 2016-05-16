#!/bin/bash
# AMMA - BDA
export REPO_DIR=/usr/share/datalab

# Default = local
DEST_FILE="$REPO_DIR/containers/datalab/env_vars.txt"
FORMAT="="
WHITESPACE=""

if [ "$1" == "remote" ] ; then
    FORMAT=": "
    WHITESPACE="  "
    DEST_FILE="$REPO_DIR/deploy/env_vars.txt"
    shift
elif [ "$1" == "local" ] ; then
    shift
fi

echo -n > "${DEST_FILE}"

# Process arguments
while [[ $# > 0 ]]
do
key="$1"

case $key in
    *)
    echo "${WHITESPACE}${key}${FORMAT}\"${2}\"" >> "${DEST_FILE}"
    shift
            # unknown option
    ;;
esac
shift # past argument or value
done
