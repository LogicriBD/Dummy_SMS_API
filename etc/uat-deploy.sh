#!/bin/bash

source ./uat.conf

echo "[DOCKER] 🚧 Building image..."

docker build --build-arg ENV_FILE=.env.uat --build-arg APP_PORT=$PORT -t $IMAGE_NAME ../ --platform linux/amd64
echo "[DOCKER] ✅ Image built successfully."

docker tag "$IMAGE_NAME:latest" "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO_NAME:$IMAGE_TAG"
echo "[DOCKER] 🔖 Image tagged successfully."

aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
echo "[ECR] 🔐 Logged in successfully."

docker push "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO_NAME:$IMAGE_TAG"
echo "[ECR] 🚀 Image pushed successfully."

echo "[CONFIG] ⏳ Uploading to remote instance."
scp -i $KEY_PATH -o IdentitiesOnly=yes ./uat.conf $REMOTE_USER@$REMOTE_IP:~
ssh -i $KEY_PATH -o IdentitiesOnly=yes $REMOTE_USER@$REMOTE_IP sudo mv ./uat.conf ${IMAGE_NAME}.conf
ssh -i $KEY_PATH -o IdentitiesOnly=yes $REMOTE_USER@$REMOTE_IP 'bash -s' < ./remote-script.sh $IMAGE_NAME