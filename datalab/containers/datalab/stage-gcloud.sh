#!/bin/bash
# Copyright 2015 Google Inc. All rights reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#  http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# Publishes the built docker image to the registry for testing purposes.


# Grant read permissions to all users on all objects added in the GCS bucket
# that holds docker image files by ACLing the bucket and setting the default
# for any new items added
PROJECT_ID=`gcloud -q config list --format yaml | grep project | awk -F" " '{print $2}'`

# Handle arguments
REPO=${1:-${PROJECT_ID}}
TAG=${2:-amma-bda}
ACCESS=${3:-true}

if [ "$ACCESS" == true ] ; then
   gsutil acl ch -g all:R gs://artifacts.$REPO.appspot.com
   gsutil defacl ch -u all:R gs://artifacts.$REPO.appspot.com
fi

LOCAL_IMAGE=datalab
CLOUD_IMAGE=gcr.io/$REPO/datalab:$TAG

echo "Publishing $LOCAL_IMAGE to $CLOUD_IMAGE ..."
docker tag -f $LOCAL_IMAGE $CLOUD_IMAGE
gcloud docker push $CLOUD_IMAGE

