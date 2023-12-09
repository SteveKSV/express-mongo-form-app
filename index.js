// Get required modules
const express = require('express');
const MongoClient = require("mongodb").MongoClient;

// Create express app 
const app = express();

// Use static files, such as html, css. 
app.use(express.static("website"));

// Include auto-parsing json
app.use(express.json());

// Create mongo client with connection string 
const mongoClient = new MongoClient("mongodb://127.0.0.1:27017");

/*  
With help of IIFE-function open connection to database and it's collection.
Then, open listening to incoming requests
*/
(async () => {
    try {
       await mongoClient.connect();
       app.locals.collection = mongoClient.db("contactsDb").collection("users");
       app.listen(3000);
       console.log("Server is waiting on http://localhost:3000");
   }catch(err) {
       return console.log(err);
   } 
})();


// Handle the POST request. Get form req.body values and create object that we insert into collection. 
app.post("/users", async(req, res)=> {
    if(!req.body) return res.sendStatus(400);
          
    const userName = req.body.name;  
    const userAge = req.body.age; 
    const userCountry = req.body.country;
    const userPhone = req.body.phone; 

    const user = {
        name: userName,
        age: userAge,
        country: userCountry,
        phone: userPhone,
    };
          
    const collection = req.app.locals.collection;
       
    try {
        await collection.insertOne(user);
        res.send(user);
    }
    catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
});

// When CTRL+C is pressed - close connection. 
process.on("SIGINT", async() => {
       
    await mongoClient.close();
    console.log("App's work is done.");
    process.exit();
});

