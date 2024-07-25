# WalkingWays - Backend
## Overview 

The backend for WalkingWays is built using Express.js and is hosted on Render. It uses Postgres for the database and Supabase for storage services. User passwords are securely hashed using bcrypt. The database was built programmatically using test-driven development (TDD).

Originally developed as part of a group final project at Northcoders, this backend has been maintained and updated with enhancements.

You may also be interested in the React Native [frontend repo](https://github.com/EllieD33/walk-the-line-frontend).

It may take a while for the API to connect initially - please be patient :)

## Features
 - **User Authentication:** Secure user login and registration using hashed passwords.
 - **Route Management:** API endpoints for creating, reading, updating, and deleting routes.
 - **Route Following:** Explore and follow routes shared by other users.
 - **Database Integration:** Uses Postgres for storing user and route data.

## Technologies Used

 - **Express.js:**  Web framework for Node.js. 
 - **Postgres:**  Relational database management system. 
 - **JavaScript:** Core programming language. 
 - **Supabase:** Backend database services. 
 - **Render:** Cloud platform for hosting web services.
 - **bcrypt:** Library for hashing passwords securely.
 - **Jest:** Testing framework.
  

## Getting Started
**Prerequisites**

 - Node.js and npm installed on your machine.  
 - Postgres database setup and running.

**Installation**

Fork and clone the repository:

    git clone https://github.com/your-username/walkingways-backend.git
    
    cd walkingways-backend


***Install dependencies***

    npm install

***Create environment variables***

To successfully clone and run this project locally, you will need to manually create the environment variables.


***Create .env.development***

In the root of the project directory, create a file named .env.development and add the following:

    PGDATABASE=walks

***Create .env.test***

In the root of the project directory, create a file named .env.test

    PGDATABASE=walks_test

***Set up local database***

Ensure you have Postgres running locally, then run the script to set up the databases:

    npm run setup-dbs

Next, seed the database:

    npm run seed

***Run the tests***

The API was built using test driven development (TDD). You can run the tests to ensure everything is working as expected:

    npm test
