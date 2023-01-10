const { DataTypes } = require('sequelize')

const db = require('../db/conn')

const UserGoogle = db.define('User', {
    name: {
        type: DataTypes.STRING,
        require: true
    },
    email: {
        type: DataTypes.STRING,
        require: true
    },
    tokenGoogleUser: {
        type: DataTypes.STRING,
        require: true
    }
})

module.exports = UserGoogle