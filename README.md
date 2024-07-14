## Installation

1. Clone the repository

2. Navigate to the project directory

```bash
cd project
```

3. Install dependencies

```bash
npm install
```

## Setup

1. Create .env file with the followings:

```bash
DATABASE_URL=./data/database.db
DISCORD_BOT_TOKEN=""
GIPHY_API=""
DISCORD_CHANNEL_ID=""
```

# Migrations

Run Migrations:

```bash
npm run migrate:latest
```

Update types:

```bash
npm run gen:types
```

## Usage

1. Start the app

```bash
npm run dev
```

## Creating new migration files

```bash
npm run create-migration -- fileNameProvidedByYou
```

## Running tests

```bash
npm run test
```

## Running test coverage

```bash
npm run coverage
```

# API Documentation

## Usage with Insomnia

### Students

#### Create Student

**Request:**

-   **Method:** POST
-   **URL:** `http://localhost:3002/students`
-   **Body:**

```json
{
    "name": "silly",
    "username": "john_doe"
}
```

#### Get All Students

**Request:**

-   **Method:** GET
-   **URL:** `http://localhost:3002/students`

#### Get Student by ID

**Request:**

-   **Method:** GET
-   **URL:** `http://localhost:3002/students/:id`
-   **Example** `http://localhost:3002/students/1`

#### Update student

**Request:**

-   **Method:** PATCH
-   **URL:** `http://localhost:3002/students/:id`
-   **Example** `http://localhost:3002/students/1`
-   **Body:**

```json
{
    "name": "new name",
    "username": "new_username"
}
```

#### Delete student

**Request:**

-   **Method:** DELETE
-   **URL:** `http://localhost:3002/students/:id`
-   **Example** `http://localhost:3002/students/1`

### Sprints

#### Create sprints

**Request:**

-   **Method:** POST
-   **URL:** `http://localhost:3002/sprints`
-   **Body:**

```json
{
    "sprintName": "WD-1.1",
    "sprintDescription": "Starting with python"
}
```

#### Get All sprints

**Request:**

-   **Method:** GET
-   **URL:** `http://localhost:3002/sprints`

#### Get sprint by ID

**Request:**

-   **Method:** GET
-   **URL:** `http://localhost:3002/sprints/:id`
-   **Example** `http://localhost:3002/sprints/1`

#### Update sprint

**Request:**

-   **Method:** PATCH
-   **URL:** `http://localhost:3002/sprints/:id`
-   **Example** `http://localhost:3002/sprints/1`
-   **Body:**

```json
{
    "sprintName": "new name here",
    "sprintDescription": "new description here"
}
```

#### Delete sprint

**Request:**

-   **Method:** DELETE
-   **URL:** `http://localhost:3002/sprint/:id`
-   **Example** `http://localhost:3002/sprint/1`

### Templates

#### Create template

**Request:**

-   **Method:** POST
-   **URL:** `http://localhost:3002/templates`
-   **Body:**

```json
{
    "text": "template text goes here"
}
```

#### Get All Templates

**Request:**

-   **Method:** GET
-   **URL:** `http://localhost:3002/templates`

#### Get template by ID

**Request:**

-   **Method:** GET
-   **URL:** `http://localhost:3002/templates/:id`
-   **Example** `http://localhost:3002/students/1`

#### Update template

**Request:**

-   **Method:** PATCH
-   **URL:** `http://localhost:3002/templates/:id`
-   **Example** `http://localhost:3002/templates/1`
-   **Body:**

```json
{
    "text": "new template text goes here"
}
```

#### Delete template

**Request:**

-   **Method:** DELETE
-   **URL:** `http://localhost:3002/templates/:id`
-   **Example** `http://localhost:3002/templates/1`

### Messages

#### Create Message

**Request:**

-   **Method:** POST
-   **URL:** `http://localhost:3002/messages`
-   **Body:**

```json
{
    "studentId": 1,
    "sprintId": 1
}
```

#### Get All Messages

**Request:**

-   **Method:** GET
-   **URL:** `http://localhost:3002/templates`
