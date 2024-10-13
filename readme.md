# Media Management System

This project is a Media Management System built using Node.js, Express, and MongoDB. It supports user authentication, role management, and media handling functionalities.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)

## Features

- User registration and login
- Role-based access control (Regular and Crown roles)
- Media upload and management
- Admin functionalities to manage users and media
- Error handling for invalid routes

## Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (cloud instance)
- **npm** (Node package manager)

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://git@github.com:usamafarooqui/media-management-system.git
   cd media-management-system
   Install the required dependencies:
   ```

bash
Copy code
npm install
Contact the admin for the .env file.

## Configuration
The application is structured with routes for user and media management.

## Routes
User routes are defined in src/routes/userRoute.js
Media routes are defined in src/routes/mediaRoute.js
Running the Application
To start the application, run:

bash
npm start

## API Endpoints
Here are some key API endpoints available in the application:

## User Endpoints
POST /api/v1/user/signup - Create a new user
POST /api/v1/user/login - Authenticate a user and obtain a token
POST /api/v1/user/:id/upgrade - Upgrade a user role to Crown (requires authentication)
Media Endpoints
POST /api/v1/media/upload - Upload media (requires authentication)
GET /api/v1/media - List all media for the authenticated user
GET /api/v1/media/:id - Retrieve specific media details
DELETE /api/v1/media/:id - Delete specific media (requires authentication)
GET /api/v1/media/admin/media - List all users' media (admin only, requires authentication)
DELETE /api/v1/media/admin/media/:id - Delete media from any user (admin only, requires authentication)
GET /api/v1/media/remaining-storage - Get the remaining storage for the authenticated user
Instructions to Customize
Replace https://git@github.com:usamafarooqui/media-management-system.git with your actual repository URL.
Adjust the MongoDB URI in the .env section to match your database credentials.
