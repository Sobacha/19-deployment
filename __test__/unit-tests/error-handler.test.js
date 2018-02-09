'use strict';

const errorHandler = require('../../lib/error-handler');

describe('Error handler module', function() {

  var mockRes = function() {
    this.resStatus = null;
    this.message = null;
    this.status = function(statusNum) {
      this.resStatus = statusNum;
      return this;
    };
    this.send = function(msg) {
      this.msg = msg;
      return this;
    };
  };


  describe('400 validation error', () => {

    test('return a status 400 with validation error', () => {
      let err = new Error('validation error');
      expect(errorHandler(err, new mockRes()).resStatus).toBe(400);
    });

  });

  describe('401 authorization error', () => {

    test('return a status 401 with authorization error', () => {
      let err = new Error('authorization error');
      expect(errorHandler(err, new mockRes()).resStatus).toBe(401);
    });

  });

  describe('404 path error', () => {

    test('return a status 404 with path error', () => {
      let err = new Error('path error');
      expect(errorHandler(err, new mockRes()).resStatus).toBe(404);
    });

  });

  describe('404 objectid failed error', () => {

    test('return a status 404 with objectid failed', () => {
      let err = new Error('objectid failed');
      expect(errorHandler(err, new mockRes()).resStatus).toBe(404);
    });

  });
  describe('409 duplicate key', () => {

    test('return a status 409 with duplicate key error', () => {
      let err = new Error('duplicate key');
      expect(errorHandler(err, new mockRes()).resStatus).toBe(409);
    });

  });
  describe('500 error', () => {

    test('return a status 500 with any other errors', () => {
      let err = new Error('500 Error');
      expect(errorHandler(err, new mockRes()).resStatus).toBe(500);
    });

  });
});
