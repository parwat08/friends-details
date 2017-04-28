const mongoose = require('mongoose');

const KEYS = require('./../config').app;
/* eslint-disable no-console */
module.exports = (app) => {
    app.mdb = KEYS.mongolab;
    mongoose.set('debug', true);
    const db = mongoose.connection;
    db.on('connecting', () => {
        console.log('connecting to MongoDB...');
    });
    db.on('error', (error) => {
        console.log(`Error in MongoDB connection: ${error}`);
    });
    db.on('connected', () => {
        console.log('MongoDB connected');
    });
    db.once('open', () => {
        console.log('MongoDB connection opened!');
    });
    db.on('reconnected', () => {
        console.log('MongoDB reconnected');
    });
    db.on('disconnected', () => {
        app.disable('mongodb');
        console.log('MongoDB disconnected');
        mongoose.connect(app.mdb, { server: { auto_reconnect: true } });
    });
    mongoose.connect(app.mdb, { server: { auto_reconnect: true } });
};
