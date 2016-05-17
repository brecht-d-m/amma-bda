#!/bin/bash
# AMMA - BDA
export REPO_DIR=/usr/share/datalab

# Default = local
DEST_FILE="$REPO_DIR/containers/datalab/env_vars.txt"
FORMAT="="
WHITESPACE=""
QUOTE=""

if [ "$1" == "remote" ] ; then
    FORMAT=": "
    WHITESPACE="  "
    DEST_FILE="$REPO_DIR/deploy/env_vars.txt"
    QUOTE="\""
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
    echo "${WHITESPACE}${key}${FORMAT}${QUOTE}${2}${QUOTE}" >> "${DEST_FILE}"
    shift
            # unknown option
    ;;
esac
shift # past argument or value
done

echo "Set the following environment variables:"
cat "${DEST_FILE}"
