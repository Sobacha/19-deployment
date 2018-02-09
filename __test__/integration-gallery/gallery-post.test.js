'use strict';

const path = require('path');
require('dotenv').config({path: path.resolve(process.cwd(), '__test__/.test.env')});
const PORT = process.env.PORT;
const faker = require('faker');
const mock = require('../lib/mock');
const superagent = require('superagent');
const server = require('../../lib/server');


describe('POST /api/v1/gallery', function() {

  beforeAll(server.start);
  afterAll(server.stop);
  afterAll(mock.auth.removeAll);
  afterAll(mock.gallery.removeAll);


  describe('Valid request', () => {

    test(
      'should return a 201 CREATED status code',
      () => {
        let mockAuth = null;

        return mock.auth.createOne()
          .then(mockData => {
            mockAuth = mockData.user;
            return superagent.post(`:${PORT}/api/v1/gallery`)
              .set('Authorization', `Bearer ${mockData.token}`)
              .send({
                name: faker.lorem.word(),
                description: faker.lorem.words(4),
              });
          })
          .then(res => {
            //console.log(res.body);
            expect(res.status).toEqual(201);
            expect(res.body).toHaveProperty('name');
            expect(res.body).toHaveProperty('description');
            expect(res.body).toHaveProperty('_id');
            expect(res.body.userId).toEqual(mockAuth._id.toString());
          });
      });
  });

  describe('Invalid request', () => {

    test('should return a 401 NOT AUTHORIZED given back token', () => {
      return superagent.post(`:${PORT}/api/v1/gallery`)
        .set('Authorization', 'Bearer BADTOKEN')
        .catch(err => expect(err.status).toEqual(401));
    });

    test('should return a 404 for not found route', () => {
      return superagent.post(`:${PORT}/api/v1/invalidgallery`)
        .catch(err => expect(err.status).toEqual(404));
    });

    test('should return a 400 BAD REQUEST on improperly formatted body', () => {
      return mock.auth.createOne()
        .then(mockData => {
          return superagent.post(`:${PORT}/api/v1/gallery`)
            .set('Authorization', `Bearer ${mockData.token}`)
            .send({})
            .catch(err => expect(err.status).toEqual(400));
        });
    });
  });
});
