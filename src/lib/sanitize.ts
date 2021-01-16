// -*- coding: utf-8; -*-
//
// Functions for sanitizing user input.

export const cleanEveryone = str => str.replace(/@+everyone/g, 'everyone');
export const cleanHere = str => str.replace(/@+here/g, 'here');

exports.sanitize = {
  cleanEveryone,
  cleanHere
};