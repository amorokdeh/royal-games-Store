var express = require('express');
var mysql = require('mysql');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');

var http = require('http').createServer(app);
var io = require('socket.io')(http);

io.on('connection', (socket) => { 
    console.log('a user connected');
});

app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '/dist/koenigsspiele')));

app.get('/', function(req,res)
{
    res.sendFile('index.html', {root: __dirname+'/dist/koenigsspiele'});

});

app.listen(8080, function(){    
  console.log("App listening on port http://localhost:8080");
});

  //Notwendige Informationen für die Verbindung zur MySQL-Datenbank
  const pool = mysql.createPool({
    host: "195.37.176.178",
    port: "20133",
    user: "22_DB_Grp_1",
    password: "MhkPbbfDO9M6OmB]xovI",
    database: "22_DB_Gruppe1"
  }); 

  //Spieler Login-Anfrage
  app.get('/api/userlist/:username/:passwort', function(req, res)
  {
        const username = (req.params.username);
        const passwort = (req.params.passwort);
        var sql = "SELECT * FROM Spieler WHERE username = ? AND passwort = ?;";
        var values = [username, passwort];
        sql=mysql.format(sql, values);
    
        pool.query(sql, values, function(err, result, fields)
        {
          if(err) throw err;
          res.send(result[0]);
        });
  });

   //Spieler suchen (mit Username)
   app.get('/api/userlist/:username', function(req, res)
   {
         const username = (req.params.username);
         var sql = "SELECT * FROM Spieler WHERE username = ?;";
         var values = [username];
         sql=mysql.format(sql, values);
     
         pool.query(sql, values, function(err, result, fields)
         {
           if(err) throw err;
           res.send(result[0]);
         });
   });

  //Spieler Registrierung in die Datenbank ein 
  app.post('/api/register', function(req,res) {
    const name = req.body.name;
    const username = req.body.username;
    const address = req.body.address;
    const email = req.body.email;
    const passwort = req.body.passwort;
    const sql = "INSERT  INTO Spieler (name, username, adresse, email, passwort) VALUES(?, ?, ?, ?, ?)";
    const values = [name, username, address, email, passwort];

    pool.query(sql, values,
      function (error, result, fields) {
        if(error) res.send(error);
        res.send(result);
      })
  });

  //Bestimmtes Spiel suchen
  app.get('/api/BestimmesSpiel/:name', function(req, res)
  {
    const name = req.params.name;
    const sql = "SELECT * FROM Spiele WHERE name = ?;";
    const values = [name];

    pool.query(sql, values,
      function (error, result, fields) {
        if(error) throw error;
        res.send(result[0]);
      });
  });

  //Alle existierenden Spiele
  app.get('/api/alleSpiele', function(req, res) {
      pool.query("SELECT * FROM Spiele", function(err, result, fields) {
        if(err) throw err;
        res.send(result);
      }); 
  });

  //Spiel in Bibliothek hinzufügen
  app.post('/api/bibpost', function(req, res) {

    const spielerID = req.body.spielerID;
    const spielID = req.body.spielID;
    const sql = "INSERT INTO Bibliothek (spielerID, spielID) VALUES(?, ?)";
    var values = [spielerID, spielID];

    pool.query(sql, values, function (error, result, fields) {
        if(error) throw error;
        res.send(result);
      })
  });

  //Überprüf ob ein Spiel in der Bib existiert
  app.get('/api/checkBibliothek/:spielerID/:spielID', function(req, res) {

    const spielerID = req.params.spielerID;
    const spielID = req.params.spielID;
    const sql = "Select Spiele.spielID, Spiele.name, Spiele.beschreibung, Spiele.preis, Spiele.erschDat from Spiele Inner Join Bibliothek on Bibliothek.spielerID = ? and Bibliothek.spielID =?;"
    var values = [spielerID, spielID];

    pool.query(sql, values, function (error, result, fields) {
        if(error) res.send(error);
        res.send(result[0]);
      })
  });

  //Alle Spiele in Bibliothek des Spieler
  app.get('/api/spielBibliothek/:spielerID', function(req, res) {
    const spielerID = req.params.spielerID;
    const sql = "Select Spiele.spielID, Spiele.name, Spiele.beschreibung, Spiele.preis, Spiele.erschDat from Spiele Inner Join Bibliothek on Bibliothek.spielID = Spiele.spielID and Bibliothek.spielerID =?;";
    const values = [spielerID];

    pool.query(sql, values,
      function (error, result, fields) {
        if(error) throw error;
        res.send(result);
      })

  })

  //Freund hinzufügen in die Datenbank
  app.post('/api/addFriend', function(req,res) {
    const name1 = req.body.username1;
    const name2 = req.body.username2;
    const sql = "INSERT INTO Freunde (username1, username2) VALUES(?, ?)";
    const values = [name1, name2];

    pool.query(sql, values,
      function (error, result, fields) {
        if(error) res.send(error);
        res.send(result);
      })
  });

    //Alle Freunde des Spieler
    app.get('/api/searchFriend/:username', function(req, res) {
      const username = req.params.username;
      const sql = "Select Spieler.name from Spieler Inner Join Freunde on (Freunde.username1 != ? and Freunde.username2 = ? and Spieler.username = Freunde.username1) or (Freunde.username2 != ? and Freunde.username1 = ? and Spieler.username = Freunde.username2);";
      const values = [username, username, username, username];
      pool.query(sql, values,
        function (error, result, fields) {
          if(error) throw error;
          res.send(result);
        })
  
    })

    //Überprüf ob ein Spieler in Freunde-Liste existiert
  app.get('/api/checkFriend/:username/:friendUsername', function(req, res) {

    const username = req.params.username;
    const friendUsername = req.params.friendUsername;
    const sql = "Select * from Freunde WHERE (username2 = ? and username1 = ?) OR (username1 = ? and username2 = ?);"
    var values = [username, friendUsername, username, friendUsername];

    pool.query(sql, values, function (error, result, fields) {
      if(error) res.send(error);
      res.send(result[0]);
    })
  });

  //for refresh
  app.route('/*').get(function (req, res) {
    return res.sendFile('index.html', {root: __dirname+'/dist/koenigsspiele'});
  });