CLOUD_PROJECT=`gcloud config list project --format text | sed 's/core\.project: //' | sed 's/google\.com/gcom/' | sed 's/[:\.]/-/g'`
USERS_FOLDER="gs://$CLOUD_PROJECT-datalab/users/"
echo $USERS_FOLDER
touch $1
gsutil cp $1 $USERS_FOLDER
rm $1
