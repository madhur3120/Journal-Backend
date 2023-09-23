# Journal Backend Application 

A backend application featuring authentication endpoints, along with a journal module tailored for both teachers and students.

## Deployment

Deployed Link - https://journal-backend-t8gt.onrender.com/api/v1

## Features
- **Authentication Service**: Simplified authentication endpoints allowing public access; with password comparison functionality. If the JWT is missing or invalid, the request will be rejected.
- **Role-based Journal Feeds**: Upon logging in, the feed is presented based on the user role, be it teacher or student.
- **Journal Management for Teachers**: Comprehensive CRUD API operations enable creation, updating, deletion, tagging, and timely publication of journal entries.

## Installation

```bash
  npm install
  npm start
```

- Add the necessary env variables in the `.env` file

Go to `http://localhost:5000/` to view the website

## Tech Stack

**Server:** NodeJS, ExpressJS, GraphQL, RestAPIs



## Environment Variables

To run this project, you will need to add the following environment variables to your .env file in the backend folder

`JWT_SECRET` - Secret key for JWT token generation.

`PORT` - Port on which the server will run (default is 5000).

`DB_HOST` - Host URL for the database.

`DB_USER` - Username for the database.

`DB_PASS` - Password for the database.

`DB_NAME` - Name of the database.

`CLOUDINARY_CLIENT_NAME` - Cloudinary client name for managing media assets.

`CLOUDINARY_CLIENT_API` - API key for Cloudinary.

`CLOUDINARY_CLIENT_SECRET` - Secret key for Cloudinary.

## API Reference

API DOCS - https://journal-backend-t8gt.onrender.com/api-docs/

### Authentication APIs

#### Register User

```http
  POST /user/register
```

| Parameter   | Type     | Description                                         |
| :---------- | :------- | :-------------------------------------------------- |
| `firstname` | `string` | **Required**. First name of the user                |
| `lastname`  | `string` | **Required**. Last name of the user                 |
| `email`     | `string` | **Required**. Email address of the user             |
| `password`  | `string` | **Required**. Password for the user                 |
| `role`      | `string` | **Required**. Role of the user (STUDENT or TEACHER) |

#### Login User

```http
  POST /user/login
```

| Parameter  | Type     | Description                             |
| :--------- | :------- | :-------------------------------------- |
| `email`    | `string` | **Required**. Email address of the user |
| `password` | `string` | **Required**. Password for the user     |

### User Feed APIs

#### Get User Feed - Protected

```http
    GET /user/feed/
```

Fetch the feed for the user which is logged in. Detects the role of the user by Auth Token and presents the feed accordingly.

### CRUD Journal APIs

#### Create Journal (Teacher)

```http
  POST /journal
```

| Parameter     | Type       | Description                                     |
| :------------ | :--------- | :---------------------------------------------- |
| `description` | `string`   | **Required**. Description of the journal entry  |
| `tagged`      | `array`    | Array of student IDs tagged in the journal      |
| `publishedAt` | `datetime` | Date and time when the journal is/was published |
| `attachment`  | `binary`   | Optional file attachment for the journal entry  |

#### Update Existing Journal (For Teacher)

```http
    PUT /journal/{id}
```

| Parameter       | Type      | Description                                             |
| :-------------- | :-------- | :------------------------------------------------------ |
| `id`            | `integer` | **Required**. ID of the journal entry to be updated     |
| `description`   | `string`  | Updated description of the journal entry                |
| `attachment_id` | `integer` | Updated attachment id of the journal                    |
| `tagged`        | `array`   | Updated list of student IDs tagged in the journal       |
| `publishedAt`   | `string`  | Updated publication date and time for the journal entry |

#### Delete a Journal Entry (For Teacher)

```http
    DELETE /journal/{id}
```

| Parameter | Type      | Description                                         |
| :-------- | :-------- | :-------------------------------------------------- |
| `id`      | `integer` | **Required**. ID of the journal entry to be deleted |

#### Publish Journal (For Teacher)

```http
      POST /journal/publish/{id}
```

| Parameter | Type      | Description                                           |
| :-------- | :-------- | :---------------------------------------------------- |
| `id`      | `integer` | **Required**. ID of the journal entry to be published |

## Authors

Madhur Saxena
