'use strict';
/*jshint esversion: 6 */

class User {
    constructor(email, password) {
        this.email = email;
        this.password = password;
        this.events = [];
    }
    addEvent(e) {
        this.events.push(e);
    }
}

module.exports = User;