#!/bin/bash

source ./"$1".conf

aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
echo "[ECR] 🔐 Logged in successfully."

UNTAGGED_IMAGES=$(aws ecr list-images --repository-name $ECR_REPO_NAME --filter "tagStatus=UNTAGGED" --query 'imageIds[*]' --output json --region $AWS_REGION)

if [[ "$UNTAGGED_IMAGES" != "[]" ]]; then
    echo "Found untagged images. Deleting..."

    # Delete untagged images
    aws ecr batch-delete-image \
        --repository-name $ECR_REPO_NAME \
        --image-ids "$UNTAGGED_IMAGES" \
        --region $AWS_REGION

    echo "Deleted untagged images."
else
    echo "No untagged images found."
fi

docker stop $IMAGE_NAME
echo "[DOCKER] ⛔ Previous image stopped successfully."

docker rm $IMAGE_NAME
echo "[DOCKER] 🔥 Previous image removed successfully."

docker pull "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO_NAME:$IMAGE_TAG"
echo "[DOCKER] 🌐 New image pulled successfully."

docker run --name $IMAGE_NAME -it -p $PORT:$PORT -d "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO_NAME:$IMAGE_TAG"
echo "[DOCKER] 🚀 New image running successfully."

docker system prune -a --force
echo "[DOCKER] 🧹 Unused docker storage cleared."
