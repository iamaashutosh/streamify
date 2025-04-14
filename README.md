# Streamify Project

Welcome to the **Streamify** project! This repository contains both the frontend and backend for the Streamify movie streaming application. Below are the instructions to set up and run the project locally.

## Prerequisites

Before you start, make sure you have the following installed on your machine:

- Python 3.x
- Node.js
- npm (Node Package Manager)
- Git

## Setting Up the Backend

The backend is a Django-based application. Follow these steps to set it up:

### 1. Navigate to the `backend` folder
Open your terminal and navigate to the `backend` folder:

```bash
cd streamify/backend
```
### 2. Setup a virtual environment in the backend to avoid conflicts
`python -m venv venv`

  #### Activate the virtual environment:
    `venv\Scripts\activate`
### 3. Install required dependencies:
  `pip install -r requirements.txt`

### 4. Setup the database
```
python manage.py makemigrations
python manage.py migrate
```


## Setting up the Frontend

### 1. Navigate to the `frontend` folder
Open your terminal and navigate to the `backend` folder:

```bash
cd streamify/frontend
```
### 2. Make sure you’re in the frontend folder, and install the dependencies listed in package.json:
```bash
npm install
```

# Running both servers(Running the code):

## 1. In the first terminal window, run the Django backend server:
```bash
cd streamify/backend
python manage.py runserver
```

## 2. In the second terminal window, run the django frontend server:
```bash
cd streamify/frontend
npm start
```

# To Run the website error free you must have a stripe account and a product in the Stripe dashboard. After that you just have to paste stripe public key, private key, product key and price key in settings.py file. If you scroll all the way down there is place to paste those keys.








