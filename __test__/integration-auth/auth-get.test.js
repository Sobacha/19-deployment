'use strict';

const path = require('path');
require('dotenv').config({path: path.resolve(process.cwd(), '__test__/.test.env')});
const server = require('../../lib/server');
const superagent = require('superagent');
const PORT = process.env.PORT;
const mock = require('../lib/mock');

describe('GET /api/v1/signin', () => { 
  
  beforeAll(() => server.start(PORT, () => console.log(`Listening on ${PORT}`)));
  afterAll(() => server.stop());
  afterAll(() => mock.auth.removeAll());
  
  
  describe('Valid req/res', () => {

    beforeAll(() => {
      return mock.auth.createOne()
        .then(auth => this.mockAuth = auth);
    });

    beforeAll(() => {
      let encoded = Buffer.from(`${this.mockAuth.user.username}:${this.mockAuth.pw}`).toString('base64');

      return superagent.get(`:${process.env.PORT}/api/v1/signin`)
        .set('Authorization', `Basic ${encoded}`)
        .then(res => this.res = res)
        .catch(console.error);
    });

    test(
      'should respond with http res status 200',
      () => {
        expect(this.res.status).toBe(200);
      });

    test(
      'should return a JSON Web Token as the response body',
      () => {
        let tokenParts = this.res.body.split('.');
        let signature = JSON.parse(Buffer.from(tokenParts[0], 'base64').toString());
        let token = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());

        expect(signature.typ).toEqual('JWT');
        expect(token).toHaveProperty('token');
      });
  });

  describe('Invalid req/res', () => {

    test(
      'should respond with http res status 400 if invalid password passed',
      () => {
        return superagent.get(`:${PORT}/api/v1/signin`)
          .auth()
          .catch(err => expect(err.status).toBe(401));
      });

    test(
      'should respond with http res status 400 if no username passed',
      () => {
        return superagent.get(`:${PORT}/api/v1/signin`)
          .auth()
          .catch(err => expect(err.status).toBe(401));
      });

    test(
      'should respond with http res status 400 if no username and password passed',
      () => {
        return superagent.get(`:${PORT}/api/v1/signin`)
          .auth()
          .catch(err => expect(err.status).toBe(401));
      });
  });

  describe('Invalid route - not /signin', () => {

    test(
      'should respond with http res status 500 if invalid route - not /signin',
      () => {
        return superagent.get(`:${PORT}/api/v1/invalidsignin`)
          .auth()
          .catch(err => expect(err.status).toBe(404));
      });
  });
});
