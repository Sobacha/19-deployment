'use strict';

const errorHandler = require('./error-handler');
const Auth = require('../model/auth');
const jwt = require('jsonwebtoken');

const ERROR_MSG = 'Authorization Failed';


module.exports = function(req, res, next){

  let authHeader = req.headers.authorization;
  if(!authHeader){
    return errorHandler(new Error(ERROR_MSG), res);
  }

  let token = authHeader.split('Bearer ')[1];
  if(!token){
    return errorHandler(new Error(ERROR_MSG), res);
  }

  jwt.verify(token, process.env.APP_SECRET, (err, decodedVal) => {
    if(err){
      err.message = ERROR_MSG;
      return errorHandler(err, res);
    }

    Auth.findOne({compareHash: decodedVal.token})
      .then(user => {
        if(!user){
          return errorHandler(new Error(ERROR_MSG), res);
        }
        req.user = user;
        next();
      })
      .catch(err => errorHandler(err, res));
  });
};

