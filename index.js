

// require function is used to evoke dependencies
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");

// for accessing sql, we need to consider grant ability to current user to modify the database
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Maf200927#MFY",
    database: "test"
});


app.use(cors());                                        // avoid CORS error for the same domain
app.use(express.json());                                // grabbing information from frontend as json file
app.use(bodyParser.urlencoded({extended: true}));       // convert sended object to json file


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


app.post("/api/addUser", (req, res) => {
    const id = req.body.id;
    const name = req.body.name;
    const password = req.body.password;

    const sqlInsert = "INSERT INTO users (id, username, password) VALUES (?,?,?)";
    db.query(sqlInsert, [id, name, password], (err, result) => {
        if (err) console.log(err);
        console.log(result);
    });
});


app.put("/api/update/idea/:id", (req, res) => {
    //console.log(req);
    const id = req.params.id;
    const idea = req.body.idea;

    const sqlUpdateIdea = "UPDATE ideas SET idea = ? WHERE id = ?";
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

    const sqlDelete = "DELETE FROM ideas WHERE id = ?"
    db.query(sqlDelete, id, (err, result) => {
        if (err) console.log(err);
    });
});

// running on port 3001
// what if domain names are different for server and client?
app.listen(3001, () => {
    console.log("running server on port 3001");
});
