const mongoose = require('mongoose');
const { connectMongo } = require('./src/config/db');
const User = require('./src/models/User');
const Assignment = require('./src/models/Assignment');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const test = async () => {
    try {
        await connectMongo();
        
        let user = await User.findOne({ email: 'test@example.com' });
        if (!user) {
            user = new User({ username: 'testuser', email: 'test@example.com', password: 'password123' });
            await user.save();
        }
        
        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1h' });
        
        const assignment = await Assignment.findOne();
        if (!assignment) {
            console.log("No assignments found to test with.");
            process.exit(1);
        }
        
        console.log(`Testing with User: ${user.email} (${user.id})`);
        console.log(`Testing with Assignment: ${assignment.title} (${assignment._id})`);
        
        const apiUrl = 'http://localhost:5000/api/progress';
        const body = {
            assignmentId: assignment._id.toString(),
            sqlQuery: "SELECT * FROM users; -- TEST QUERY " + Date.now(),
            isCompleted: false
        };
        
        console.log("Sending request to:", apiUrl);
        const res = await fetch(apiUrl, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'x-auth-token': token 
            },
            body: JSON.stringify(body)
        });
        
        const data = await res.json();
        console.log("Save Response Status:", res.status);
        console.log("Save Response Data:", data);
        
        const fetchUrl = `http://localhost:5000/api/progress?assignmentId=${assignment._id}`;
        const fetchRes = await fetch(fetchUrl, {
             headers: { 'x-auth-token': token }
        });
        const fetchData = await fetchRes.json();
        
        console.log("Fetch Response Status:", fetchRes.status);
        console.log("Fetch Response Data Length:", fetchData.length);
        console.log("Fetched Query:", fetchData[0]?.sqlQuery);
        
        if (fetchData.length > 0 && fetchData[0].sqlQuery === body.sqlQuery) {
            console.log("SUCCESS: Backend Save/Load cycle is working.");
        } else {
            console.log("FAILURE: Fetched data does not match saved data.");
        }
        
    } catch (err) {
        console.error("Test failed:", err);
    } finally {
        process.exit();
    }
};

test();
