<h2>This is a simple form, which creates a contact in database</h2>

<h3>The project includes:</h3>

<ul>
  <li>Express.js for creating a simple server of the web-app</li>
  <li>MongoDb as a database for data storage</li>
  <li>HTML, CSS and simple JavaScript for creating page, styling it and send requests to the server</li>
</ul>

<h3>Steps: </h3>

<ol>
  <li>
    Create a folder in which you will be working. For example: 'FormApp'.
  </li>
  <li>
    Create another folder inside project folder. It is a folder for front-end files (HTML, CSS, JS). 
  </li>
  <li>
    Create a file 'index.html' and make a skeleton of your form. For example: <br/><br/>

    
    <main>
        <div class="heading-container">
            <h1>Give your contacts</h1>
            <p>For us to know about your account!</p>           
        </div>
        <div class="container-form">
            <form action="#" method="post" id="myForm">
                <input 
                    type="text" 
                    tabindex="1" 
                    id='firstName' 
                    name="firstName" 
                    placeholder="First name"
                    required>
                <input 
                    type="text" 
                    tabindex="2" 
                    id='lastName' 
                    name="lastName" 
                    placeholder="Last Name"
                    required>
                <input 
                    type="number" 
                    tabindex="3" 
                    id='age' 
                    name="age" 
                    placeholder="Age"
                    required>
                <select 
                    name="country" 
                    tabindex="4" 
                    id='country'>
                        <option value="Ukraine">Ukraine</option>
                        <option value="England" selected>England</option>
                        <option value="USA">USA</option>
                        <option value="Japan">Japan</option>
                </select>
                <input 
                    type="tel" 
                    tabindex="5" 
                    id='phone' 
                    name="phone" 
                    placeholder="+38 (xxx) xxx-xx-xx"
                    required>
                <input 
                    type="submit" 
                    tabindex="6" 
                    id='customSubmit'>
                <input 
                    type="reset" 
                    tabindex="7" 
                    id='customReset'>
            </form>
        </div>
    </main>

    <script src="clientSide.js">
        
    </script>
  </li>
  <li>
    Stylize your form how you want. 
  </li>
  <li>
    Create JavaScript file in which you will hanlde operations for buttons (submit, reset) and their logic. <br/><br/>

    async function CreateUser(userFirstName, userLastName, userAge, userCountry, userPhone) {
      const response = await fetch("/users", {
          method: "POST",
          headers: { "Accept": "application/json", "Content-Type": "application/json" },
          body: JSON.stringify({
              name: `${userFirstName} ${userLastName}`,
              age: parseInt(userAge, 10),
              country: userCountry,
              phone: userPhone,
          })
      });
  
      if (response.ok === true) {
          customFormReset();
      }
    }

    function customFormReset() {
        document.getElementById("myForm").reset();
    }
    
    document.getElementById("customReset").addEventListener("click", e => {
        e.preventDefault();
        customFormReset();
    });
    
    document.forms["myForm"].addEventListener("submit", e => {
        e.preventDefault();
        const form = document.forms["myForm"];
        const firstName = form.elements["firstName"].value;
        const lastName = form.elements["lastName"].value;
        const age = form.elements["age"].value;
        const country = form.elements["country"].value;
        const phone = form.elements["phone"].value;

        CreateUser(firstName, lastName, age, country, phone);
    });
  Here we declare asynchronous function 'CreateUser', 
  which takes 5 parameters, sends a POST-request to the /users endpoint, makes headers and sets the body of the POST-request as JavaScript-object converted to JSON string.
  If the response from the server is okay (200 status code), then the form is reseted with the help of the function 'customFormReset'. 
  </li>
  <li>
    Go to the outside of the static files folder. Open the terminal and enter: <br/><br/> 
    <pre>
      <code>
          npm init
      </code>
    </pre>   
  </li>
  <li>
    Then, create index.js file and starts to code your server. <br/><br/>

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
  </li>
  <li>
    When done, enter: <br/><br/>
    <pre>
      <code>
        node index.js
      </code>
    </pre>
    And go to the http:localhost:3000 in your browser.
  </li>
  <li>
    See the result of your work: 
  </li>
</ol>

![image](https://github.com/SteveKSV/express-mongo-form-app/assets/113126311/7335f6a0-28ae-4499-9bc2-709bccd65cc7)

