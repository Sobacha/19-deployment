'use strict';

const path = require('path');
require('dotenv').config({path: path.resolve(process.cwd(), '__test__/.test.env')});
const PORT = process.env.PORT;
const faker = require('faker');
const mock = require('../lib/mock');
const superagent = require('superagent');
const server = require('../../lib/server');
const Photo = require('../../model/photo');
const img = `${__dirname}/../lib/x.jpeg`;


describe('POST /api/v1/photo', function() {

  beforeAll(server.start);
  afterAll(server.stop);
  afterAll(mock.auth.removeAll);
  afterAll(mock.gallery.removeAll);
  afterAll(() => Photo.remove());


  describe('Valid request', () => {

    test(
      'should return a 201 CREATED status code',
      () => {
        let mockAuth, mockGallery;

        return mock.gallery.createOne()
          .then(mockData => {

            mockAuth = mockData.auth;
            mockGallery = mockData.gallery;

            return superagent.post(`:${PORT}/api/v1/photo`)
              .set('Authorization', `Bearer ${mockAuth.token}`)
              .field('name', faker.lorem.word())
              .field('desc', faker.lorem.words(4))
              .field('galleryId', `${mockGallery._id}`)
              .attach('image', img);
          })
          .then(res => {
            expect(res.status).toEqual(201);
            expect(res.body).toHaveProperty('name');
            //expect(res.body).toHaveProperty('description');
            //expect(res.body).toHaveProperty('_id');
            //expect(res.body.userId).toEqual(mockAuth._id.toString());
          });
        //          .catch(err => console.log(err));
      });
  });

  describe('Invalid request', () => {

    test('should return a 401 NOT AUTHORIZED given back token', () => {
      return superagent.post(`:${PORT}/api/v1/photo`)
        .set('Authorization', 'Bearer BADTOKEN')
        .catch(err => expect(err.status).toEqual(401));
    });

    test('should return a 404 for not found route', () => {
      return superagent.post(`:${PORT}/api/v1/invalidphoto`)
        .catch(err => expect(err.status).toEqual(404));
    });

    test('should return a 400 BAD REQUEST on improperly formatted body', () => {
      return mock.auth.createOne()
        .then(mockData => {
          return superagent.post(`:${PORT}/api/v1/photo`)
            .set('Authorization', `Bearer ${mockData.token}`)
            .field('name', '400test')
            .attach('image', img)
            .catch(err => expect(err.status).toEqual(400));
        });
    });
  });
});
