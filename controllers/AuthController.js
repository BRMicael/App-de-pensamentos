const User = require('../models/User');

module.exports = class AuthController {
    static login(req, res) {
        res.render('auth/login')
    }

    static register(req, res) {
        res.render ('auth/register')
    }

    static async registerPost(req, res) {
        // async pois haverá interações com o banco




    }

}