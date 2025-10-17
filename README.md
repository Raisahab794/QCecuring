# Task Manager Dashboard

A fullstack application built with React, Node.js, Express, and MongoDB that allows users to create, update, view, and delete tasks while maintaining an audit log of all actions.

## Features

- Create, update, view, and delete tasks
- Filter tasks by title or description
- Pagination for both tasks and audit logs
- Secure API endpoints with basic authentication
- Input validation and sanitization
- Responsive design

## Tech Stack

- **Frontend**: React
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Authentication**: Basic Authentication

## Project Structure

```
task-manager/
├── client/ (React Frontend)
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── App.js
│       ├── api.js
│       └── index.js
└── server/ (Node.js Backend)
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── utils/
    └── server.js
```

## Setup Instructions

### Prerequisites
- Node.js
- MongoDB

### Backend Setup
1. Navigate to server directory: `cd server`
2. Install dependencies: `npm install`
3. Start the server: `npm start` or `npm run dev` for development

### Frontend Setup
1. Navigate to client directory: `cd client`
2. Install dependencies: `npm install`
3. Start the application: `npm start`

### Authentication
- Username: admin
- Password: password123

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/tasks | Get all tasks (with pagination and filtering) |
| POST   | /api/tasks | Create a new task |
| PUT    | /api/tasks/:id | Update an existing task |
| DELETE | /api/tasks/:id | Delete a task |
| GET    | /api/logs | Get all audit logs (with pagination) |
