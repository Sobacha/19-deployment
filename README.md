## 18 Asset management

Asset management AWS S3- /api/v1/photo/:id

##### `POST /api/v1/photo` request

<Valid input>
  * pass data as stringified JSON in the body of a **POST** request and attach a image to upload to S3
  * this should return a 201 status code with the new record content

<Invalid input>
  * If no schema and/or no name and/or no description is/are sent, it rejects and throws an error with a 400 status
  * If no correct token provided, it rejects and throws an error with a 401 status

##### `GET /api/v1/photo ||  /api/v1/photo/:id` request

###### -- 1) fetch one specified by id
<Valid input>
  * pass `<uuid>` as a query string parameter to retrieve a specific resource (as JSON)
  * this should return a 200 status code with the requested record

<Invalid input>
  * If no schema and/or no id is/are sent, it rejects and throws an error with a status 400
  * If no item exists, it rejects and throws an error with a status 404
  * If no correct token provided, throws an error with a status 401

###### -- 2) fetch all specified by id
<Valid input>
  * retrieve all resource (as JSON)
  * this should return a 200 status code with the requested record

<Invalid input>
  * If no schema is sent, it rejects and throws an error with a status 400
  * If no schema exists, it rejects and throws an error with a status 404
  * If no correct token provided, throws an error with a status 401


## Usage

git clone this repo in your desired location
```
git clone <this repo's clone ssh>
```
install dependencies
```
npm install
```
start server
```
node index.js
```

##### `POST /api/v1/gallery/:id` request

<Valid input>
  * pass data as stringified JSON in the body of a **POST** request to create a new gallery
  * this should return a 201 status code with the new record content

<Invalid input>
  * If no schema and/or (no name and no description) is/are sent, it rejects and throws an error with a 400 status

##### `GET / ||  /api/v1/gallery/:id` request

###### -- 1) fetch one specified by id
<Valid input>
  * pass `<uuid>` as a query string parameter to retrieve a specific resource (as JSON)
  * this should return a 200 status code with the requested record

<Invalid input>
  * If no schema and/or no id is/are sent, it rejects and throws an error with a status 400
  * If no item exists, it rejects and throws an error with a status 404
  * If no token provided, throws an error with a status 401

###### -- 2) fetch all specified by id
<Valid input>
  * retrieve all resource (as JSON)
  * this should return a 200 status code with the requested record

<Invalid input>
  * If no schema is sent, it rejects and throws an error with a status 400
  * If no schema exists, it rejects and throws an error with a status 404
  * If no token provided, throws an error with a status 401

##### `PUT  /api/v1/gallery/:id` request

<Valid input>
  * pass `<uuid>` as a query string parameter, with a body of data to update a specific resource (as JSON)
  * this should return a 204 status code with no content in the body

<Invalid input>
  * If no schema and/or no id is/are sent, it rejects and throws an error with a status 400
  * If no item exists, it rejects and throws an error with a status 404
  * If no token provided, throws an error with a status 401

##### `DELETE  /api/v1/gallery/:id` request

###### -- 1) delete one specified by id
<Valid input>
  * pass `<uuid>` in the query string to **DELETE** a specific resource
  * this should return a 204 status code with no content in the body

<Invalid input>
  * If no schema and/or no id is/are sent, it rejects and throws an error with a status 400
  * If no item exists, it rejects and throws an error with a status 404
  * If no token provided, throws an error with a status 401

###### -- 2) delete all specified by id
<Valid input>
  * delete all resource (as JSON)
  * this should return a 200 status code with the requested record

<Invalid input>
  * If no schema is sent, it rejects and throws an error with a status 400
  * If no schema exists, it rejects and throws an error with a status 404
  * If no token provided, throws an error with a status 401


##### `POST /signup` request

<Valid request>
  * pass username, password, email as stringified JSON in the request body of a **POST** request to register and authorize a user
  * this should return a 201 status code with token returned

<Invalid request>
  * If no username and/or no password is/are sent, it rejects and throws an error with a 400 status
  * If route is not correct, it rejects and throws an error with a status 404

##### `GET /signin` request

<Valid request>
  * pass username and password in http headers of **GET** request to verify a user
  * this should return a 200 status code with token returned

<Invalid request>
  * If no username and/or no password is/are sent, it rejects and throws an error with a status 401
  * If route is not correct, it rejects and throws an error with a status 404

