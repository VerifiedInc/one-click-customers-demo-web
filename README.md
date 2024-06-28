# 1-Click Demo Web

## Overview

> This project shows the real implementation of 1-Click Signup of Verified Inc in a simple web application.

The project is implemented using the [Remix](https://remix.run/docs) full stack web framework. Additional information about the Verified demo ecosystem can be found in our [documentation](https://docs.verified.inc/demo-1-click-signup).

### Remix

While knowledge of the Remix framework is not fully required to observe and understand the simplicity of the Verified reusable credential implementation it is worth noting that Remix has a notion of "middleware" that serves as a lightweight backend, which takes the form an express server.

Because of this characteristic, even though this is a client side app, not all of the software in this repo is executed in the browser. The files with the naming convention `.server.` denote that they are executed on the express server. This is an important distinction because your Verified API Key used to authenticate needs to be kept secret and can only be used in a secure backend environment. **TL;DR, Please do not call the Verified API directly from client side code that is executed in the browser because the API key is sensitive.**

## Interacting with the Demo

The live web app can be found [here](https://1click.demo.sandbox-verifiedinc.com).

The application's home page is a sample registration page. In order to "register", you will need to enter the provided test phone number (+10123456789). If you prefer, you may instead enter your own email address and/or phone number. Ensure the value(s) you enter are valid as a OTP will be required at a later step.

After you (the test user) submits the phone number, the following occurs to leverage your existing credentials.

1. A `POST` request is made to [/1-click](https://1click.demo.sandbox-verifiedinc.com).
2. A match for the requested credentials is found and you are redirected to the Verified Web Wallet to complete the share credentials request flow.
3. After you elect to share your credentials, the Verified Web Wallet redirects back to the Hooli demo with a `1ClickUuid` and `optedOut`(being true if user cancelled or false if user finished the flow) query parameter.
4. The `1ClickUuid` is used in a `GET` request made to [/1-click/{uuid}](https://docs.verified.inc/#receive-user-data). This gives Hooli access to the credentials, and a user session is created. _Note: A brand's access to shared credentials is deleted after 5 minutes of the initial credential data retrieval._

Functionality for the critical api calls can be found in the [coreAPI.server.ts](https://github.com/VerifiedInc/one-click-demo-web/blob/main/app/coreAPI.server.ts) file. Both POST and GET `1-click` are called in the [register.tsx](https://github.com/VerifiedInc/one-click-demo-web/blob/main/app/routes/register.tsx) file.

## Development

### Getting Started

Install necessary dependencies

```sh
npm install
```

Make a clone of the `.env.example` file and save as `.env` in the demo's root directory. There are a few items worth noting for setting up the `.env`.

- `PORT` can be updated to whichever port you'd prefer the demo to run on locally. If the value of `PORT` is changed, you will also need to change the port specified in the `DEMO_URL`.
- `VERIFIED_API_KEY` needs to be populated with the API key you've been provided.
- `CORE_SERVICE_URL` and `VERIFIED_WALLET_URL` are defaulted to the Verified Core Service API and Web Wallet in our sandbox environment.
- `CORE_SERVICE_ADMIN_AUTH_KEY` is an Verified Inc Only, internal environment key which is used to allow custom branding and brand API Key fetching. This can be ignored for reference purposes.

### Running

Start the Remix development asset server and the Express server by running:

```sh
npm run dev
```

_Note: The demo will launch on the specified `PORT` in the `.env` file._

### Database

To have local development currently is just running a docker image:

Pull image:

```sh
docker pull postgres:latest
```

Run image:

```sh
docker run --name one-click-demo-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=oneclick_demo -p 5444:5432 -d postgres
```

#### Migration And Entity

These scripts are related to Prisma, a database toolkit that includes an Object-Relational Mapping (ORM) for Node.js and TypeScript. They are used to manage your database schema and generate Prisma Client.

1. `"db:migrate:dev": "prisma migrate dev"`: This script is used to apply migrations in a development environment. It creates a new migration if the Prisma schema has changed, applies the migration to the database, and generates Prisma Client.

2. `"db:migrate:prod": "prisma migrate deploy"`: This script is used to apply migrations in a production environment. It applies all pending migrations to the database. Unlike `prisma migrate dev`, it does not create new migrations or generate Prisma Client.

3. `"db:generate": "prisma generate"`: This script is used to generate Prisma Client based on your Prisma schema. Prisma Client is an auto-generated and type-safe query builder for Node.js and TypeScript.
