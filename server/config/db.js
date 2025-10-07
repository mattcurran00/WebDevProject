//file to hopefully get a bleedin database working

const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        await mongoose.connect('mongodb://127.0.0.1:27017/webdevproject', {
              useNewUrlParser: true,
              useUnifiedTopology: true
            });
            console.log('DB whatsit');
        }catch(err) {
        
        console.error(err.message);
        process.exit(1);
        }
    };
module.exports = connectDB;