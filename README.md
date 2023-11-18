# Shopping Lists

This web application is built using **PostgreSQL** as the database, **Node.js** as the server-side runtime, and **EJS** (Embedded JavaScript) for templating. The application leverages migration and seed scripts to set up the initial database schema and populate it with sample data.

- This web application show a pre-populated list of shoppers and shopping items (5 items and 5 shoppers).
- Users are able to create a shopping list for each shopper and save it.
- One item can be found in a maximum of 3 shopping lists, so the 4th person should not be able to put this item in the list.
- After the lists are saved, the user is able to see the created list.

## Technologies 
- **PostgreSQL**: A powerful open-source relational database.  
- **Node.js**: A JavaScript runtime for server-side development.  
- **Express.js**: A minimal and flexible Node.js web application framework.  
- **EJS (Embedded JavaScript)**: A templating engine for generating HTML markup with JavaScript.  

## Installation
### Clone the Repository:
```
git clone https://github.com/ensarh98/Shopping-lists.git
cd Shopping-lists
```
### Install Dependencies:
```
npm install
```
### Configure Database:
Set up a PostgreSQL database and update the connection details in `.env`.
### Execute Migration and Seed Scripts
Using a database tool, execute migration and seed scripts in the `public` schema. The scripts are available in the **doc** folder.

## Usage
Run the Application:
```
npm run dev
```
The web application will be accessible at `http://localhost:3000`.
## Explore the Application:
All shopping lists are displayed on the home page.  

![image](https://github.com/ensarh98/Shopping-lists/assets/120948569/f90a322a-2280-4a60-8f34-ed0feaecc035)  
Clicking on the **Details** button opens the details of the shopping list.  
![image](https://github.com/ensarh98/Shopping-lists/assets/120948569/bfc4372d-e475-4303-a68a-9294e5e5cda6)  

## Project Structure
- `config/dbConfig.js`: Database configuration file. 
- `doc/`: Folder containing database migration and seed scripts to populate the database with sample data.
- `public/`: Static assets (stylesheets) served by the application.
- `routes/`: Express.js route handlers for different parts of the application.
- `views/`: EJS templates for rendering dynamic HTML content.
- `app.js`: Main application file.


