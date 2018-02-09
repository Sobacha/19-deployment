'use strict';

const Gallery = require('../model/gallery');
const bodyParser = require('body-parser').json();
const errorHandler = require('../lib/error-handler');
const bearerAuthMiddleware = require('../lib/bearer-auth-middleware');


module.exports = router => {

  router.route('/gallery/:id?')
    .post(bearerAuthMiddleware, bodyParser, (req, res) => {
      req.body.userId = req.user._id;

      return new Gallery(req.body).save()
        .then(createdGallery => res.status(201).json(createdGallery))
        .catch(err => errorHandler(err, res));
    })

    .get(bearerAuthMiddleware, bodyParser, (req, res) => {
      if(req.params.id){
        return Gallery.findById(req.params.id)
          .then(gallery => res.status(200).json(gallery))
          .catch(err => errorHandler(err, res));
      }
      return Gallery.find()
        .then(galleries => {
          let galleriesIds = galleries.map(gallery => gallery._id);

          res.status(200).json(galleriesIds);
        })
        .catch(err => errorHandler(err, res));
    })

    .put(bearerAuthMiddleware, bodyParser, (req, res) => {
      req.body.userId = req.user._id;
      //console.log(req.body);
      //console.log(req.user);
      return Gallery.findByIdAndUpdate(req.params.id, req.body, {upsert: true, runValidators: true})
        .then(() => res.status(204).end())
        .catch(err => errorHandler(err, res));
    })

    .delete(bearerAuthMiddleware, bodyParser, (req, res) => {
      if(req.params.id){
        return Gallery.findById(req.params.id)
          .then(gallery => gallery.remove())
          .then(() => res.status(204).end())
          .catch(err => errorHandler(err, res));
      }
      return Gallery.remove({})
        .then(() => res.status(200).end())
        .catch(err => errorHandler(err, res));
    });
};
