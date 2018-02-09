'use strict';

const faker = require('faker');
const Auth = require('../../model/auth');
const Gallery = require('../../model/gallery');

const mock = module.exports = {};



// Auth mock - Mock create one, remove all
mock.auth = {};

mock.auth.createOne = () => {
  let createdAuth = {};

  createdAuth.pw = faker.internet.password();

  return new Auth({
    username: faker.internet.userName(),
    email: faker.internet.email(),
  })
    .hashPassword(createdAuth.pw)
    .then(user => createdAuth.user = user)
    .then(user => user.generateToken())
    .then(token => createdAuth.token = token)
    .then(() => {return createdAuth;});
};

mock.auth.removeAll = () => Promise.all([Auth.remove()]);


// Galery mock = Mock create one, remove all
mock.gallery = {};

mock.gallery.createOne = () => {
  let authAndGallery = {};

  return mock.auth.createOne()
    .then(createdMockAuth => authAndGallery.auth = createdMockAuth)
    .then(createdMockAuth => {
      return new Gallery({
        name: faker.internet.domainWord(),
        description: faker.random.word(15),
        userId: createdMockAuth.user._id,
      }).save();
    })
    .then(gallery => {
      authAndGallery.gallery = gallery;
      return authAndGallery;
    });
};

mock.gallery.removeAll = () => Promise.all([Gallery.remove()]);
