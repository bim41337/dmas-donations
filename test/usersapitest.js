'use strict';

const assert = require('chai').assert;
var request = require('sync-request');

const url = 'http://localhost:4000/api/users';

suite('Users API tests', function () {

  test('get users', function () {
    var res = request('GET', url);
    const users = JSON.parse(res.getBody('utf8'));

    assert.equal(4, users.length);

    assert.equal(users[0].firstName, 'Initial');
    assert.equal(users[1].firstName, 'Homer');
    assert.equal(users[2].firstName, 'Marge');
    assert.equal(users[3].firstName, 'Bart');

  });

  test('create a user', function () {

    const newUser = {
      firstName: 'James',
      lastName: 'Hardfield',
      email: 'james@met.ca',
    };

    const res = request('POST', url, { json: newUser });
    const returnedUser = JSON.parse(res.getBody('utf8'));

    assert.equal(returnedUser.firstName, 'James');
    assert.equal(returnedUser.lastName, 'Hardfield');
    assert.equal(returnedUser.email, 'james@met.ca');

  });

  test('Delete one user', function () {
    let res = request('GET', url);
    const users = JSON.parse(res.getBody('utf8'));

    const oneUserUrl = url + '/' + users[0]._id;
    res = request('DELETE', oneUserUrl);
    assert.isEmpty(res.body);
  });

  test('Delete all users', function () {
    const response = request('DELETE', url);
    assert.equal(response.statusCode, 204);

    const getResponse = request('GET', url);
    const users = JSON.parse(getResponse.getBody('utf8'));
    assert.isEmpty(users);
  });

});
