'use strict';

const path = require('path');
require('dotenv').config({path: path.resolve(process.cwd(), '__test__/.test.env')});
const PORT = process.env.PORT;
const faker = require('faker');
const mock = require('../lib/mock');
const superagent = require('superagent');
const server = require('../../lib/server');


describe('GET /api/v1/gallery', function() {

  beforeAll(server.start);
  afterAll(server.stop);
  afterAll(mock.auth.removeAll);
  afterAll(mock.gallery.removeAll);


  describe('Valid request', () => {

    test(
      'should return a 200 FETCHED status code',
      () => {
        let mockAuth, mockGallery;

        return mock.gallery.createOne()
          .then(mockData => {

            mockAuth = mockData.auth;
            mockGallery = mockData.gallery;

            return superagent.get(`:${PORT}/api/v1/gallery/${mockGallery._id}`)
              .set('Authorization', `Bearer ${mockAuth.token}`)
              .then(res => {
                //console.log(res.body);
                expect(res.status).toEqual(200);
                expect(res.body.name).toEqual(mockGallery.name);
                expect(res.body.description).toEqual(mockGallery.description);
                expect(res.body._id).toEqual(mockGallery._id.toString());
              });
          });
      });

    test(
      'should return a 200 FETCHED status code',
      () => {
        let mockAuth, mockGalleryOne, mockGalleryTwo;

        return mock.gallery.createOne()
          .then(mockData => {

            mockAuth = mockData.auth;
            mockGalleryOne = mockData.gallery;

            return superagent.post(`:${PORT}/api/v1/gallery`)
              .set('Authorization', `Bearer ${mockAuth.token}`)
              .send({name: faker.lorem.word(), description: faker.lorem.words(4)})
              .then(res => {
                mockGalleryTwo = res;

                return superagent.get(`:${PORT}/api/v1/gallery`)
                  .set('Authorization', `Bearer ${mockAuth.token}`)
                  .then(res => {
                    //console.log('BODY', res.body);
                    expect(res.status).toEqual(200);
                    expect(res.body).toContain(mockGalleryOne._id.toString());
                    expect(res.body).toContain(mockGalleryTwo.body._id.toString());
                  });
              });
          });
      });
  });

  describe('Invalid request', () => {

    test('should return a 401 NOT AUTHORIZED given back token', () => {
      return superagent.get(`:${PORT}/api/v1/gallery`)
        .set('Authorization', 'Bearer BADTOKEN')
        .catch(err => expect(err.status).toEqual(401));
    });

    test('should return a 404 for not found route', () => {
      return superagent.get(`:${PORT}/api/v1/invalidgallery`)
        .catch(err => expect(err.status).toEqual(404));
    });

    test('should return a 404 with invalid id', () => {
      return mock.auth.createOne()
        .then(mockData => {
          return superagent.get(`:${PORT}/api/v1/gallery/1234`)
            .set('Authorization', `Bearer ${mockData.token}`)
            .catch(err => expect(err.status).toEqual(404));
        });
    });
  });
});
