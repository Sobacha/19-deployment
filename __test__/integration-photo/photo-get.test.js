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


describe('GET /api/v1/photo', function() {

  beforeAll(server.start);
  afterAll(server.stop);
  afterAll(mock.auth.removeAll);
  afterAll(mock.gallery.removeAll);
  afterAll(() => Photo.remove());


  describe('Valid request', () => {

    test(
      'should return a 200 FETCHED status code',
      () => {
        let mockAuth, mockGallery, mockPhoto;

        return mock.gallery.createOne()
          .then(mockData => {

            mockAuth = mockData.auth;
            mockGallery = mockData.gallery;

            return superagent.post(`:${PORT}/api/v1/photo`)
              .set('Authorization', `Bearer ${mockAuth.token}`)
              .field('name', faker.lorem.word())
              .field('desc', faker.lorem.words(4))
              .field('galleryId', `${mockGallery._id}`)
              .attach('image', img)
              .then(res => {

                mockPhoto = res.body;

                return superagent.get(`:${PORT}/api/v1/photo/${mockPhoto._id}`)
                  .set('Authorization', `Bearer ${mockAuth.token}`)
                  .then(res => {
                    //console.log(res.body);
                    expect(res.status).toEqual(200);
                    expect(res.body.name).toEqual(mockPhoto.name);
                    expect(res.body.description).toEqual(mockPhoto.description);
                    //expect(res.body._id).toEqual(mockPhoto._id.toString());
                  });
              });
          });
      });

    test(
      'should return a 200 FETCHED status code',
      () => {
        let mockAuth, mockGallery, mockPhotoOne, mockPhotoTwo;

        return mock.gallery.createOne()
          .then(mockData => {

            mockAuth = mockData.auth;
            mockGallery = mockData.gallery;

            return superagent.post(`:${PORT}/api/v1/photo`)
              .set('Authorization', `Bearer ${mockAuth.token}`)
              .field('name', faker.lorem.word())
              .field('desc', faker.lorem.words(4))
              .field('galleryId', `${mockGallery._id}`)
              .attach('image', img)
              .then(res => {
                mockPhotoOne = res.body;

                return superagent.post(`:${PORT}/api/v1/photo`)
                  .set('Authorization', `Bearer ${mockAuth.token}`)
                  .field('name', faker.lorem.word())
                  .field('desc', faker.lorem.words(4))
                  .field('galleryId', `${mockGallery._id}`)
                  .attach('image', img)
                  .then(res => {
                    mockPhotoTwo = res.body;

                    return superagent.get(`:${PORT}/api/v1/photo`)
                      .set('Authorization', `Bearer ${mockAuth.token}`)
                      .then(res => {
                        expect(res.status).toEqual(200);
                        expect(res.body).toContain(mockPhotoOne._id.toString());
                        expect(res.body).toContain(mockPhotoTwo._id.toString());
                      });
                  });
              });
          });
      });
  });

  describe('Invalid request', () => {

    test('should return a 401 NOT AUTHORIZED given back token', () => {
      return superagent.get(`:${PORT}/api/v1/photo`)
        .set('Authorization', 'Bearer BADTOKEN')
        .catch(err => expect(err.status).toEqual(401));
    });

    test('should return a 404 for not found route', () => {
      return superagent.get(`:${PORT}/api/v1/invalidphoto`)
        .catch(err => expect(err.status).toEqual(404));
    });

    test('should return a 404 with invalid id', () => {
      return mock.auth.createOne()
        .then(mockData => {
          return superagent.get(`:${PORT}/api/v1/photo/1234`)
            .set('Authorization', `Bearer ${mockData.token}`)
            .catch(err => expect(err.status).toEqual(404));
        });
    });
  });
});
