'use strict';

const path = require('path');
require('dotenv').config({path: path.resolve(process.cwd(), '__test__/.test.env')});
const PORT = process.env.PORT;
const mock = require('../lib/mock');
const superagent = require('superagent');
const server = require('../../lib/server');


describe('PUT /api/v1/gallery', function() {

  beforeAll(server.start);
  afterAll(server.stop);
  afterAll(mock.auth.removeAll);
  afterAll(mock.gallery.removeAll);


  describe('Valid request', () => {

    test(
      'should return a 200 UPDATED status code',
      () => {
        let mockAuth, mockGallery;

        return mock.gallery.createOne()
          .then(mockData => {

            mockAuth = mockData.auth;
            mockGallery = mockData.gallery;
            return superagent.put(`:${PORT}/api/v1/gallery/${mockGallery._id}`)
              .set('Authorization', `Bearer ${mockAuth.token}`)
              .send({
                name: 'updated',
                description: 'UPDATED',
              })
              .then(() => {
                return superagent.get(`:${PORT}/api/v1/gallery/${mockGallery._id}`)
                  .set('Authorization', `Bearer ${mockAuth.token}`)
                  .then(res => {
                    expect(res.body.name).toEqual('updated');
                    expect(res.body.description).toEqual('UPDATED');
                    expect(res.body._id).toEqual(mockGallery._id.toString());
                  });
              });
          });
      });
  });

  describe('Invalid request', () => {

    test('should return a 401 NOT AUTHORIZED given back token', () => {
      return superagent.put(`:${PORT}/api/v1/gallery`)
        .set('Authorization', 'Bearer BADTOKEN')
        .catch(err => expect(err.status).toEqual(401));
    });

    test('should return a 404 for not found route', () => {
      return superagent.put(`:${PORT}/api/v1/invalidgallery`)
        .catch(err => expect(err.status).toEqual(404));
    });

    test('should return a 400 BAD REQUEST on improperly formatted body', () => {
      return mock.auth.createOne()
        .then(mockData => {
          return superagent.put(`:${PORT}/api/v1/gallery`)
            .set('Authorization', `Bearer ${mockData.token}`)
            .send({})
            .catch(err => expect(err.status).toEqual(400));
        });
    });
  });
});
