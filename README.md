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

POST
http://localhost:3002/students

```bash
{
"name": "silly",
"username": "johdn_doe"
}
```

http://localhost:3002/sprints

```bash
{
"sprintName": "WD-1.1",
"sprintDescription": "Starting with python"
}
```

http://localhost:3002/templates

```bash
{
"text": "you did it"
}
```

http://localhost:3002/messages ( was congratulate before )

```bash
{

      "studentId": 1,
      "sprintId": 1

}
```
