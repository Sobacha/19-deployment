'use strict';

const errorHandler = require('./error-handler');
const debug = require('debug')('http:basic-auth-middleware');

module.exports = function(req, res, next){
  let authHeaders = req.headers.authorization;
  if(!authHeaders){
    debug('Headers error');
    return errorHandler(new Error('Authorization failed. Headers do not match requirements'). res);}

  let base64 = authHeaders.split('Basic ')[1];
  if(!base64){
    debug('No username/password error');
    return errorHandler(new Error('Authorization failed. Username and password required.'), res);}

  let [username, password] = Buffer.from(base64, 'base64').toString().split(':');
  req.auth = {username, password};

  if(!req.auth.username){
    debug('No username error');
    return errorHandler(new Error('Authorization failed. Username required.'), res);}
  if(!req.auth.password){
    debug('No password error');
    return errorHandler(new Error('Authorization failed. Password required.'), res);}

  next();
};
