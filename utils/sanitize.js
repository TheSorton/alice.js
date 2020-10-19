// -*- coding: utf-8; -*-
//
// Functions for sanitizing user input.

const cleanEveryone = str => str.replace(/@+everyone/g, 'everyone');
const cleanHere = str => str.replace(/@+here/g, 'here');

exports.sanitize = {
  cleanEveryone,
  cleanHere
};

