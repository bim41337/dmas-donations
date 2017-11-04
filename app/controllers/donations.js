'use strict';

const Joi = require('joi');

const Candidate = require('../models/candidate');
const Donation = require('../models/donation');
const User = require('../models/user');

exports.home = {

  handler: function (request, reply) {
    Candidate.find({}).then(candidates => {
      reply.view('home', {
        title: 'Make a Donation',
        candidates: candidates,
      });
    }).catch(err => {
      reply.redirect('/');
    });
  },

};

exports.donate = {
  validate: {

    payload: {
      amount: Joi.number().greater(0),
      method: Joi.string().required(),
      candidate: Joi.string().required(),
    },

    failAction: function (request, reply, source, error) {
      Candidate.find({}).then(allCandidates => {
        reply.view('home', {
          title: 'ERROR: Make a Donation',
          errors: error.data.details,
          amount: request.payload.amount,
          candidates: allCandidates,
        }).code(400);
      }).catch(err => {
        reply.redirect('/');
      });
    },

    options: {
      abortEarly: false,
    },

  },

  handler: function (request, reply) {
    var userEmail = request.auth.credentials.loggedInUser;
    let userId = null;
    let donation = null;
    User.findOne({ email: userEmail }).then(user => {
      let data = request.payload;
      userId = user._id;
      donation = new Donation(data);
      const rawCandidate = request.payload.candidate.split(',');
      return Candidate.findOne({ lastName: rawCandidate[0], firstName: rawCandidate[1] });
    }).then(candidate => {
      donation.donor = userId;
      donation.candidate = candidate._id;
      return donation.save();
    }).then(newDonation => {
      reply.redirect('/report');
    }).catch(err => {
      reply.redirect('/');
    });
  },

};

exports.report = {

  handler: function (request, reply) {
    Donation.find({}).populate('donor').populate('candidate').then(allDonations => {
      let totalAmount = allDonations.reduce((acc, don) => acc + don.amount, 0);
      reply.view('report', {
        title: 'Donations to Date',
        donations: allDonations,
        total: totalAmount,
      });
    }).catch(err => {
      reply.redirect('/');
    });
  },

};
