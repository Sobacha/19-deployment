'use strict';

const path = require('path');
require('dotenv').config({path: path.resolve(process.cwd(), '__test__/.test.env')});
const server = require('../../lib/server');
const superagent = require('superagent');
const PORT = process.env.PORT;
const faker = require('faker');
const mock = require('../lib/mock');


describe('POST /api/v1/signup', () => { 

  beforeAll(() => server.start(PORT, () => console.log(`Listening on ${PORT}`)));
  afterAll(() => server.stop());
  afterAll(() => mock.auth.removeAll);

  
  describe('Valid req/res', () => {
      
    test(
      'should respond with http res status 201',
      () => {
        let mockAuth = {
          username: faker.internet.userName(),
          password: faker.internet.password(),
          email: faker.internet.email(),
        };

        return superagent.post(`:${PORT}/api/v1/signup`)
          .send({'username': `${mockAuth.username}`, 'password': `${mockAuth.password}`, 'email': `${mockAuth.email}`})
          .then(res => {
            expect(res.status).toBe(201);
          });
      });

    test(
      'should return a valid token',
      () => {
        let mockAuth = {
          username: faker.internet.userName(),
          password: faker.internet.password(),
          email: faker.internet.email(),
        };

        return superagent.post(`:${PORT}/api/v1/signup`)
          .send({'username': `${mockAuth.username}`, 'password': `${mockAuth.password}`, 'email': `${mockAuth.email}`})
          .then(res => {
            let tokenParts = res.body.split('.');
            let signature = JSON.parse(Buffer.from(tokenParts[0], 'base64').toString());
            let token = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());

            expect(signature.typ).toEqual('JWT');
            expect(token).toHaveProperty('token');
          });
      });

  });

  describe('Invalid req/res', () => {

    test(
      'should respond with http res status 400 if no password passed',
      () => {
        return superagent.post(`:${PORT}/api/v1/signup`)
          .send({'username': 'Test Signin', 'email': 'test@test.com'})
          .catch(err => expect(err.status).toBe(400));
      });

    test(
      'should respond with http res status 400 if no username passed',
      () => {
        return superagent.post(`:${PORT}/api/v1/signup`)
          .send({'password': 'Test pw', 'email': 'test@test.com'})
          .catch(err => expect(err.status).toBe(400));
      });

    test(
      'should respond with http res status 400 if no username and password passed',
      () => {
        return superagent.post(`:${PORT}/api/v1/signup`)
          .send({'email': 'test@test.com'})
          .catch(err => expect(err.status).toBe(400));
      });
  });

  describe('Invalid route - not /signup', () => {

    test(
      'should respond with http res status 404 if not valid route - not /singup',
      () => {
        return superagent.post(`:${PORT}/api/v1/invalidsignup`)
          .send({'username': 'Test Signin', 'password': 'pw', 'email': 'test@test.com'})
          .catch(err => expect(err.status).toBe(404));
      });
  });
});
