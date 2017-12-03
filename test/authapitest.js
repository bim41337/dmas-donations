'use strict';

const assert = require('chai').assert;
const DonationService = require('./donation-service');
const fixtures = require('./fixtures.json');
const utils = require('../app/api/utils.js');

suite('Auth API tests', function () {

  let users = fixtures.users;
  let candidates = fixtures.candidates;

  const donationService = new DonationService(fixtures.donationService);

  test('login-logout', function () {
    var returnedCandidates = donationService.getCandidates();
    assert.isNull(returnedCandidates);

    const response = donationService.login(users[0]);
    returnedCandidates = donationService.getCandidates();
    assert.isNotNull(returnedCandidates);

    donationService.logout();
    returnedCandidates = donationService.getCandidates();
    assert.isNull(returnedCandidates);
  });
});
