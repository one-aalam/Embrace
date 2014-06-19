var app = require('../server'),
	request = require('supertest');


describe('My app\'s api', function(){
	describe('When requesting resource /api/test', function(){
		it('should respond with 200', function(done){
			request(app)
			.get('api/test')
			.expect('Content-Type', 'application/json')
			.expect(200, done);
			
		});
	});
	
});