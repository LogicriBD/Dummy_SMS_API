# RESTful API Node Server Template

# Package Scripts Guide

This project includes several npm scripts for development, testing, and deployment. Below is a description of each script and how to use it.

## Pre-requisites

Install pm2 globally using

```sh
npm i --global pm2
```

For unix-based systems you may need to get super user access via sudo

## Available Scripts

### Build

```sh
npm run build
```

This command compiles the TypeScript files into JavaScript using `tsc` (TypeScript Compiler) based on the `tsconfig.json` configuration.

### Development

```sh
npm run dev
```

Runs the application in development mode using `ts-node-dev`, which provides automatic restarts when file changes are detected.

### Start (Production)

```sh
npm run start
```

Starts the application using `pm2-runtime`, which is optimized for running Node.js applications in production environments. It uses `ecosystem.config.js` for process management.

### Testing

```sh
npm run test
```

Executes tests using `jest` and generates a coverage report.

### Pre-test Checks

```sh
npm run pretest
```

Runs `jest --detectOpenHandles` to identify any open handles that might cause tests to hang.

## Notes

- `npm run dev` is recommended for local development.
- `npm run start` is intended for production deployment with `pm2`.
- Before running tests, ensure dependencies are installed using:

  ```sh
  npm install
  ```

  ## Bruno

  Additionally, it is recommended to use Bruno for API testing, you can download bruno from this link. [Bruno](https://www.usebruno.com/downloads)

  After downloading Bruno, you can just open the api-collection folder in etc and you would get the API endpoints configured for integration testing using Bruno.

  Additionally, sample test cases such as login testing and fetching current users are provided in the test directory as sample tests which you can later extend on.

  ## Environment Variables

  We have also provided a sample env file below, you can use this to make your own custom env files:

```

# API Configurations

CLIENT_URL=**\*\***
NODE_ENV=**\*\***
HTTP_PORT=**\*\***
ALLOWED_ORIGINS=**\*\***
SALT_SIZE=**\*\***

# AWS S3

AWS_ACCESS_KEY_ID=**\*\***
AWS_SECRET_ACCESS_KEY=**\*\***
AWS_BUCKET_NAME=**\*\***
AWS_REGION=**\*\***
AWS_DEFAULT_FOLDER=**\*\***

MONGO_URL=**\*\***

# System Admin Account

SUDO_EMAIL=**\*\***
SUDO_PASSWORD=**\*\***

# RabbitMQ Configurations

RABBITMQ_URL=**\*\***

# JWT Configurations

JWT_SECRET=**\*\***
JWT_ACCESS_EXPIRATION_MINUTES=**\*\***
JWT_REFRESH_EXPIRATION_MINUTES=**\*\***
JWT_RESET_PASSWORD_EXPIRATION_MINUTES=**\*\***
JWT_VERIFY_EMAIL_EXPIRATION_MINUTES=**\*\***

# Locking Configurations

MAX_LOGIN_ATTEMPTS=**\*\***
ACCOUNT_LOCK_DURATION_MINUTE=**\*\***

# SMS Configurations

SMS_STATIC_KEY=**\*\***
SMS_USER_NAME=**\*\***
SMS_PASSWORD=**\*\***
SMS_MASKING=**\*\***
SMS_DEFAULT_OTP=**\*\***

# Email Configurations

SMTP_HOST=**\*\***
SMTP_PORT=**\*\***
SMTP_TLS=**\*\***
SMS_ENDPOINT=**\*\***
SMTP_USERNAME=**\*\***
SMTP_PASSWORD=**\*\***
EMAIL_FROM=**\*\***

```

# Deployment

For deployment you would be needing the uat.conf files and the prod.conf files for UAT deployment and Production deployment respectively, the Dockerfile has been provided and using this Dockerfile we can create the container and push the container in the respective repository, the scripts provided in the etc folder only needs to be run with the conf file and the appropriate private key, and it would automatically be deployed

```

```
