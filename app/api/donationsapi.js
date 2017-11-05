'use strict';

const Donation = require('../models/donation');
const Boom = require('boom');

exports.findAllDonations = {

  auth: false,

  handler: function (request, reply) {
    Donation.find({}).populate('donor').populate('candidate').then(donations => {
      reply(donations);
    }).catch(err => {
      reply(Boom.badImplementation('error accessing db'));
    });
  },

};

exports.findDonations = {

  auth: false,

  handler: function (request, reply) {
    Donation.find({ candidate: request.params.id }).then(donations => {
      reply(donations);
    }).catch(err => {
      reply(Boom.badImplementation('error accessing db'));
    });
  },

};

exports.makeDonation = {

  auth: false,

  handler: function (request, reply) {
    const donation = new Donation(request.payload);
    donation.candidate = request.params.id;
    donation.save().then(newDonation => {
      reply(newDonation).code(201);
    }).catch(err => {
      reply(Boom.badImplementation('error making donation'));
    });
  },

};

exports.deleteAllDonations = {

  auth: false,

  handler: function (request, reply) {
    Donation.remove({}).then(err => {
      reply().code(204);
    }).catch(err => {
      reply(Boom.badImplementation('error removing Donations'));
    });
  },

};

exports.deleteCandidateAllDonations = {

  auth: false,

  handler: function (request, reply) {
    let candidateId = request.params.id;
    Donation.remove({ candidate: candidateId }).then(err => {
      reply({ message: 'Removed all donations for candidate ' + candidateId }).code(204);
    }).catch(err => {
      reply(Boom.badImplementation('error removing Donations for a candidate'));
    });
  },

};
