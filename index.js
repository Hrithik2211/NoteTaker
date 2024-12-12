const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');


app.get('/', function (req, res) {
  // readdir is use to read the data of your given directory which is ./files(I created it)
  fs.readdir('./files', function (err, files) {
    res.render('index', { files: files }); //this is how we can send files data to our html client or index.ejs
  });
});

// after writing my notes I have to create file and store the data in it
app.post('/create', function (req, res) {
  fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`,req.body.details, function (err) {
    res.redirect("/")
  })
});

// this is where I will read a file and its content and send it to show.ejs at frontend
app.get('/file/:filename', function (req, res) {
  fs.readFile(`./files/${req.params.filename}`, function (err, filedata) {
    res.render("show",{filename:req.params.filename, filedata:filedata})
  })
});
// when I have to edit then I will be sent to edit page and my filename will be sent so that I can get old name
app.get('/edit/:filename', function (req, res) {
  res.render('edit',{filename:req.params.filename})
});

// This will happen when you push update button 
app.post('/edit', function (req, res) {
  fs.rename(`./files/${req.body.previous}`, `./files/${req.body.new}`, function (err) {
    res.redirect("/")
  })
});

app.get("/delete", function (req, res) {
  fs.unlink("./Notetaker.txt", (err) => {
    res.redirect("/");
  })
})

app.listen(8000);
