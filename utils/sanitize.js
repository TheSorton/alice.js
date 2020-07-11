// -*- coding: utf-8; -*-
//
// Functions for sanitizing user input.

const clean_everyone = str => str.replace(/@+everyone/g, 'everyone');
const clean_here = str => str.replace(/@+here/g, 'here');

exports.sanitize = {
    clean_everyone,
    clean_here
};

