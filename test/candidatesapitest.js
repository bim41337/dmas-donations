'use strict';

const assert = require('chai').assert;
var request = require('sync-request');

const url = 'http://localhost:4000/api/candidates';

suite('Candidate API tests', function () {

  test('get candidates', function () {
    var res = request('GET', url);
    const candidates = JSON.parse(res.getBody('utf8'));

    assert.equal(2, candidates.length);

    assert.equal(candidates[0].firstName, 'Lisa');
    assert.equal(candidates[0].lastName, 'Simpson');
    assert.equal(candidates[0].office, 'President');

    assert.equal(candidates[1].firstName, 'Donald');
    assert.equal(candidates[1].lastName, 'Simpson');
    assert.equal(candidates[1].office, 'President');

  });

  test('get one candidate', function () {

    var res = request('GET', url);
    const candidates = JSON.parse(res.getBody('utf8'));

    const oneCandidateUrl = url + '/' + candidates[0]._id;
    res = request('GET', oneCandidateUrl);
    const oneCandidate = JSON.parse(res.getBody('utf8'));

    assert.equal(oneCandidate.firstName, 'Lisa');
    assert.equal(oneCandidate.lastName, 'Simpson');
    assert.equal(oneCandidate.office, 'President');

  });

  test('create a candidate', function () {

    const newCandidate = {
      firstName: 'Barnie',
      lastName: 'Grumble',
      office: 'President',
    };

    const res = request('POST', url, { json: newCandidate });
    const returnedCandidate = JSON.parse(res.getBody('utf8'));

    assert.equal(returnedCandidate.firstName, 'Barnie');
    assert.equal(returnedCandidate.lastName, 'Grumble');
    assert.equal(returnedCandidate.office, 'President');

  });

  test('Delete all candidates', function () {
    const response = request('DELETE', url);
    assert.equal(response.statusCode, 204);

    const getResponse = request('GET', url);
    const candidates = JSON.parse(getResponse.getBody('utf8'));
    assert.isEmpty(candidates);
  });

});
