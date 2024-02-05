const mongoose = require('mongoose');
const { dbKey } = require('../../config');


module.exports = async function(app) {
    try {
        console.log('Waiting for db connection ..');
        let connection = await mongoose.connect(dbKey, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        if(connection) {
            // console.log("Connected to local DB!");
            console.log(`Connected to cloud DB!`);
        }
    } catch (err) {
        console.log(`Couldn't connect to DB! ${err}`);
    }
    if (app) {
        app.set("mongoose", mongoose);
    }
};