'use strict';

const HEROKU_MODE = true;
const assert = require('chai').assert;
const DonationService = require('./donation-service');
const fixtures = require('./fixtures.json');
const _ = require('lodash');

suite('Candidate API tests', function () {

  let candidates = fixtures.candidates;
  let newCandidate = fixtures.newCandidate;

  const baseUrl = HEROKU_MODE ? fixtures.donationServiceHerokuUrl
      : fixtures.donationServiceLocalhostUrl;
  const donationService = new DonationService(baseUrl);

  beforeEach(function () {
    donationService.deleteAllCandidates();
  });

  afterEach(function () {
    donationService.deleteAllCandidates();
  });

  test('create a candidate', function () {
    const returnedCandidate = donationService.createCandidate(newCandidate);
    assert(_.some([returnedCandidate], newCandidate),
        'returnedCandidate must be a superset of newCandidate');
    assert.isDefined(returnedCandidate._id);
  });

  test('get candidate', function () {
    const c1 = donationService.createCandidate(newCandidate);
    const c2 = donationService.getCandidate(c1._id);
    assert.deepEqual(c1, c2);
  });

  test('get invalid candidate', function () {
    const c1 = donationService.getCandidate('1234');
    assert.isNull(c1);
    const c2 = donationService.getCandidate('012345678901234567890123');
    assert.isNull(c2);
  });

  test('delete a candidate', function () {
    const c = donationService.createCandidate(newCandidate);
    assert(donationService.getCandidate(c._id) != null);
    donationService.deleteOneCandidate(c._id);
    assert(donationService.getCandidate(c._id) == null);
  });

  test('get all candidates', function () {
    for (let c of candidates) {
      donationService.createCandidate(c);
    }

    const allCandidates = donationService.getCandidates();
    assert.equal(allCandidates.length, candidates.length);
  });

  test('get candidates detail', function () {
    for (let c of candidates) {
      donationService.createCandidate(c);
    }

    const allCandidates = donationService.getCandidates();
    for (var i = 0; i < candidates.length; i++) {
      assert(_.some([allCandidates[i]], candidates[i]),
          'returnedCandidate must be a superset of newCandidate');
    }
  });

  test('get all candidates empty', function () {
    const allCandidates = donationService.getCandidates();
    assert.equal(allCandidates.length, 0);
  });

});
