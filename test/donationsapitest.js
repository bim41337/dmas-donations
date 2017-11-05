'use strict';

const HEROKU_MODE = false;
const assert = require('chai').assert;
const DonationService = require('./donation-service');
const fixtures = require('./fixtures.json');
const _ = require('lodash');

suite('Donation API tests', function () {

  let donations = fixtures.donations;
  let newCandidate = fixtures.newCandidate;

  const baseUrl = HEROKU_MODE ? fixtures.donationServiceHerokuUrl
      : fixtures.donationServiceLocalhostUrl;
  const donationService = new DonationService(baseUrl);

  beforeEach(function () {
    donationService.deleteAllCandidates();
    donationService.deleteAllDonations();
  });

  afterEach(function () {
    donationService.deleteAllCandidates();
    donationService.deleteAllDonations();
  });

  test('create a donation', function () {
    const returnedCandidate = donationService.createCandidate(newCandidate);
    donationService.makeDonation(returnedCandidate._id, donations[0]);
    const returnedDonations = donationService.getDonations(returnedCandidate._id);
    assert.equal(returnedDonations.length, 1);
    assert(_.some([returnedDonations[0]], donations[0]),
        'returned donation must be a superset of donation');
  });

  test('create multiple donations', function () {
    const returnedCandidate = donationService.createCandidate(newCandidate);
    for (var i = 0; i < donations.length; i++) {
      donationService.makeDonation(returnedCandidate._id, donations[i]);
    }

    const returnedDonations = donationService.getDonations(returnedCandidate._id);
    assert.equal(returnedDonations.length, donations.length);
    for (var i = 0; i < donations.length; i++) {
      assert(_.some([returnedDonations[i]], donations[i]),
          'returned donation must be a superset of donation');
    }
  });

  test('delete all donations', function () {
    const returnedCandidate = donationService.createCandidate(newCandidate);
    for (let i = 0; i < donations.length; i++) {
      donationService.makeDonation(returnedCandidate._id, donations[i]);
    }

    const d1 = donationService.getDonations(returnedCandidate._id);
    assert.equal(d1.length, donations.length);
    donationService.deleteAllDonations();
    const d2 = donationService.getDonations(returnedCandidate._id);
    assert.equal(d2.length, 0);
  });

  test('delete all donations for single candidate', function () {
    const returnedCandidate = donationService.createCandidate(newCandidate);
    const fallbackCandidate = donationService.createCandidate(fixtures.newFallbackCandidate);
    for (let i = 0; i < donations.length; i++) {
      donationService.makeDonation(returnedCandidate._id, donations[i]);
      donationService.makeDonation(fallbackCandidate._id, donations[i]);
    }

    const d1c = donationService.getDonations(returnedCandidate._id);
    const d1f = donationService.getDonations(fallbackCandidate._id);
    assert.equal(d1c.length, donations.length);
    assert.equal(d1f.length, donations.length);
    donationService.deleteCandidateAllDonations(returnedCandidate._id);
    const d2c = donationService.getDonations(returnedCandidate._id);
    const d2f = donationService.getDonations(fallbackCandidate._id);
    const d2a = donationService.getAllDonations();
    assert.equal(d2c.length, 0);
    assert.equal(d2f.length, donations.length);
    assert.notEqual(d2a.length, 0);
  });

});
