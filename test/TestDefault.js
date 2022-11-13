const request = require('supertest');
var assert = require('assert');
var app = require('../app');

var token1 = "";
var token2 = "";

// Test tokenize post request
describe('Unit Test - http requests', function() {
  it('Tokenize requests', function(done) {
    request(app)
      .post('/tokenize')
	  .send('[4111-1111-1111-1111, 4564-3222-3456-9871]')
	  .set('Content-Type', 'text/plain')
      .set('Accept', 'text/plain')
      .expect( response => {
		//console.log("First token: " + response.body[0]);
		token1 = response.body[0];
		token2 = response.body[1];
	  })
	  .expect(200, done)
  });
});

// Test De-tokenize POST request
describe('Unit Test - http requests', function() {
  it('Detokenize requests', function(done) {
    request(app)
      .post('/detokenize')
	  .send('[' + token1 + ',' + token2 + ']')
	  .set('Content-Type', 'text/plain')
      .set('Accept', 'text/plain')
      .expect(200)
	  .end(function(err, res) {
        if (err) return done(err);
        return done();
      });
  });
});

// Test default page
describe('Unit Test - http requests', function() {
  it('Default requests', function(done) {
    request(app)
      .get('/')
      .set('Accept', 'application/html')
      .expect(200, done);
  });
});

// Test any other method not implemented or available - ERROR case
describe('Unit Test - http requests', function() {
  it('Error requests', function(done) {
    request(app)
      .get('/user')
      .set('Accept', 'application/html')
      .expect(404, done);
  });
});