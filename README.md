# Art Museum Inventory Management Application

## Prerequisites

Before running the project, make sure the following are installed on your machine:

* Node.js
* npm
* Docker Engine / Docker Desktop

If using Windows with Docker Desktop, make sure Docker Engine is running before starting the backend.

---

## Backend setup and run instructions

Open a terminal and run:

- cd backend
- npm install
- docker compose up -d
- npm run seed
- npm run dev

Notes:

- 'docker compose up -d' starts the MongoDB database in Docker
- 'npm run seed' imports the artworks from 'Artworks.json' into MongoDB
- the seed process may take some time depending on the dataset size
- 'npm run dev' starts the backend server

The backend should then run at:

- http://localhost:3000

---

## Frontend setup and run instructions

Open a second terminal and run:

- cd .\frontend\
- npm install
- npm run dev

The frontend should then run at:

- http://localhost:5173

---

## Environment configuration

The backend requires a '.env.local' file inside the 'backend' folder.

Example:

MONGODB_URI=mongodb://127.0.0.1:27017/artmuseum
JWT_SECRET=murcia_es_la_mejor_region
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000

The frontend requires a .env file inside the frontend folder.

Example:

VITE_API_BASE_URL=http://localhost:3000/api

The backend also requires this file:

- https://github.com/MuseumofModernArt/collection/blob/main/Artworks.json

If its missing, download it and place it in backend/data/

---

## How to use the application

1. Start the backend
2. Start the frontend
3. Open the frontend in the browser at http://localhost:5173
4. Register a staff account
5. Log in with that account
6. You can now use and test the app

The backend also serves an About page at:

http://localhost:3000/about

This page is also accessible from the frontend through the About this Page button.

---

## How to stop the application

To stop the frontend or backend dev servers in the command line interface, press:

Ctrl + C

To stop MongoDB Docker container, run from the backend folder:

- docker compose down
