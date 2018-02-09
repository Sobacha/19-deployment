'use strict';

const path = require('path');
require('dotenv').config({path: path.resolve(process.cwd(), '__test__/.test.env')});
const PORT = process.env.PORT;
const mock = require('../lib/mock');
const superagent = require('superagent');
const server = require('../../lib/server');


describe('DELETE /api/v1/gallery', function() {

  beforeAll(server.start);
  afterAll(server.stop);
  afterAll(mock.auth.removeAll);
  afterAll(mock.gallery.removeAll);


  describe('Valid request', () => {

    test(
      'should return a 200 DELETED status code',
      () => {
        let mockAuth, mockGallery;

        return mock.gallery.createOne()
          .then(mockData => {

            mockAuth = mockData.auth;
            mockGallery = mockData.gallery;

            return superagent.delete(`:${PORT}/api/v1/gallery/${mockGallery._id}`)
              .set('Authorization', `Bearer ${mockAuth.token}`)
              .then(res => {
                //console.log(res.body);
                expect(res.status).toEqual(204);
              });
          });
      });
  });

  describe('Invalid request', () => {

    test('should return a 401 NOT AUTHORIZED given back token', () => {
      let mockGallery;

      return mock.gallery.createOne()
        .then(mockData => {

          mockGallery = mockData.gallery;

          return superagent.delete(`:${PORT}/api/v1/gallery/${mockGallery._id}`)
            .set('Authorization', 'Bearer BADTOKEN')
            .catch(err => expect(err.status).toEqual(401));
        });
    });

    test('should return a 404 for not found route', () => {
      return superagent.delete(`:${PORT}/api/v1/invalidgallery/12345`)
        .catch(err => expect(err.status).toEqual(404));
    });

  });
});
