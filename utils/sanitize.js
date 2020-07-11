// -*- coding: utf-8; -*-
//
// Functions for sanitizing user input.

const clear_everyone = str => str.replace(/@+everyone/g, 'everyone');
const clear_here = str => str.replace(/@+here/g, 'here');

exports.sanitize = {
    clear_everyone,
    clear_here
};

