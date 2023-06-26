# E-commerce

## Description

This application demonstrates a basic back-end for an e-commerce site using a simple object model involving categories, tags, and products. Routes have been built to retrieve all data from each table as well as paths for Creating, Updating, and Deleting records. In the case of updating products, an array of tag ids can be provided in the request body to reassociate those records.

![MySQL workbench with each CRUD route](assets/e-commerce-routes.png?raw=true)

## Usage

1. Install the relevant dependencies.
2. Update the environment variables to connect to your mysql database. Add an environment variable to your machine called MYSQL_DB_PASS that contains the value for your mysql server password.
3. Execute 'npm run schema' to create the ecommerce database.
4. Execute 'npm run seed' to load initial data into the categories, tags, and products tables.
5. Execute 'npm run start' to start the server.
6. Start sending requests to http://localhost:3001!

This video walks through using the app: https://drive.google.com/file/d/1IJPDBGADMvSmqqiMmEluBmxAWQPRu7_z/view
