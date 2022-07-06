

// require function is used to evoke dependencies
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");


// bcrypt dependency is used to hash use password, which secures user's information
const bcrypt = require("bcrypt");       
const salRounts = 10;
// install another dependency (bcrypt: to hash user password, they don't want you to store the actually word in your database) 


// install express-session/cookieParser dependency
const cookieParser = require("cookie-parser");      // concept of cookie: retrieve data stored on web
const session = require("express-session");         // maintaining session, so we could keep user login



// for accessing sql, we need to consider grant ability to current user to modify the database
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Maf200927#MFY",
    database: "test"
});


app.use(cors({
    origin: ["http://localhost:3000"],          // origin url
    methods: ["GET", "POST"],
    credentials: true
}));                          // avoid CORS error for the same domain

app.use(express.json());                                // grabbing information from frontend as json file
app.use(bodyParser.urlencoded({extended: true}));       // convert sended object to json file
app.use(cookieParser());
app.use(session({
    key: "userID",
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60 * 60 * 24,                          // expires time 24h in this case
    },
}));



app.get("/api/get", (req, res) => {
    const sqlSelect = "SELECT * FROM ideas;"
    db.query(sqlSelect, (err, result) => {
        res.send(result);       // sent result to frontend
    });
    //res.send({ "id": 6, "name": "Feiyang Ma", "major": "Computer Science" });
});


app.post("/api/insert", (req, res) => {
    const id = req.body.id;
    const proposer = req.body.proposer;
    const idea = req.body.idea;
    const votes = req.body.votes;
    //const table = req.params.table;

    const sqlInsert = "INSERT INTO ideas (id, proposer, idea, votes) VALUES (?,?,?,?)";
    db.query(sqlInsert, [id, proposer, idea, votes], (err, result) => {
        if (err) console.log(err);
    });
});


app.put("/api/update/idea/:id", (req, res) => {
    //console.log(req);
    const id = req.params.id;
    const idea = req.body.idea;

    const sqlUpdateIdea = "UPDATE ideas SET idea = ? WHERE id = ?;";
    db.query(sqlUpdateIdea, [idea, id], (err, result) => {
        if (err) console.log(err);
        //console.log(result);
    });
});


// FIXME: somethings it could modify the idea but sometimes it doesn't
app.put("/api/update/votes/:id", (req, res) => {
    const votes = req.body.votes;
    const id = req.params.id;

    const sqlUpdateVotes = "UPDATE ideas SET votes = ? WHERE id = ?";    
    db.query(sqlUpdateVotes, [votes, id], (err, result) => {
        if (err) console.log(err);
        //console.log(result);
    });
});


app.delete("/api/delete/:id", (req, res) => {
    // ":" in above url is the syntax to pass in parameters in url
    //console.log(req);
    const id = req.params.id;

    const sqlDelete = "DELETE FROM ideas WHERE id = ?;"
    db.query(sqlDelete, id, (err, result) => {
        if (err) console.log(err);
    });
});



// CRUD requests for login and register features
app.post("/register", (req, res) => {
    //const id = req.body.id;
    const name = req.body.name;
    const password = req.body.password;


    bcrypt.hash(password, salRounts, (err, hash) => {
        if (err) console.log(err);

        const sqlInsert = "INSERT INTO users (username, password) VALUES (?,?);";
        db.query(sqlInsert, [name, hash], (error, result) => {
            if (error) console.log(error);
            console.log(result);
        });
    });

    /*
    const sqlInsert = "INSERT INTO users (username, password) VALUES (?,?);";
    db.query(sqlInsert, [name, password], (err, result) => {
        if (err) console.log(err);
        console.log(result);
    });
    */
});



// get method to maintain user session, which should be done for every page we have on based url
app.get("/login", (req, res) => {
    if (req.session.user)
        res.send({ isLogin: true, user: req.session.user });
    else
        res.send({ isLogin: false });
});

// post method is used to send information through network
app.post("/login", (req, res) => {
    const name = req.body.name;
    const password = req.body.password;

    const sqlSelect = "SELECT * FROM users WHERE username = ?;";
    db.query(sqlSelect, name, (err, result) => {
        if (err) 
        {
            res.send({ err: err });
        }
        else if (result.length > 0)
        {
            bcrypt.compare(password, result[0].password, (error, compareResult) => {
                if (compareResult)
                {
                    req.session.user = result;          // creating a session on request called user
                    console.log(req.session.user);
                    res.send(result);
                }
                else
                    res.send({ message: "Wrong username/password combination!"});
            });
        }
        else
        {
            res.send({ message: "User doesn't exist!" });
        }
    });
});


// running on port 3001
// what if domain names are different for server and client?
app.listen(3001, () => {
    console.log("running server on port 3001");
});
