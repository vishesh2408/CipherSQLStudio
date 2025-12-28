const mongoose = require('mongoose');
const UserProgress = require('./src/models/UserProgress');
const { connectMongo } = require('./src/config/db');
require('dotenv').config();

const checkProgress = async () => {
    await connectMongo();
    const progress = await UserProgress.find({});
    console.log(JSON.stringify(progress, null, 2));
    process.exit();
};

checkProgress();
