var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

var path = require('path');
app.use(express.static(path.join(__dirname, './static')));

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mongoose_crud');

var MongooseSchema = new mongoose.Schema({
    name: String,
    age: Number
})

mongoose.model('Mongoose', MongooseSchema); // We are setting this Schema in our Models as 'Quote'
var Mongoose = mongoose.model('Mongoose') // We are retrieving this Schema from our Models, named 'Quote'

// Use native promises
mongoose.Promise = global.Promise;


app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');


//root route and displays all the mongooses
app.get('/', function(req, res) {
    Mongoose.find({}, function(err, mongooses) {
        if(err) {
            console.log(err);
            return redirect('/');
        }
        else {
            res.render('index', {themongooses: mongooses});
        }
    });
});



//get route to render the form to add a new mongoose
app.get('/monkey/new', function(req, res) {
    res.render('new');
})

//post route to add new a mongoose
app.post('/monkey', function(req, res) {
    console.log("POST DATA", req.body);
    //create a new mongoose
    var mongooses = new Mongoose({name: req.body.name, age: req.body.age});
    mongooses.save(function(err) {
        // if there is an error console.log that something went wrong!
        if(err) {
            console.log('something went wrong');
        } else { 
            console.log('successfully added a new mongoose');
        }
    })
    res.redirect('/');
})

//get route to show the info about the mongoose
app.get('/monkey/:id', function(req, res) {
    Mongoose.find({_id: req.params.id}, function(err, mongooses) {
        if(err) {
            console.log(err);
            return redirect('/');
        }
        else {
            res.render('show', {themongooses: mongooses});
        }
    });
});

app.get('/monkey/edit/:id', function(req, res) {
    Mongoose.find({_id: req.params.id}, function(err, mongooses) {
        if(err) {
            console.log(err);
            return redirect('/');
        }
        else {
            res.render('edit', {themongooses: mongooses});
        }
    });
})

app.post('/monkey/:id', function(req, res){
    Mongoose.findById(req.params.id, function(err, mongoose) {
        if(err) {
            console.log(err);
        } else {
            mongoose.name = req.body.name;
            mongoose.age = req.body.age;
            mongoose.save();
        }
    })
    res.redirect('/')
})


app.post('/monkey/destroy/:id', function(req, res){
    Mongoose.findById(req.params.id, function(err, mongoose) {
        if(err) {
            console.log(err);
        } else {
            mongoose.remove({_id: req.params.id}, function(err) {
                if(err) {
                    console.log(err);
                } else {
                    console.log("succesfully deleted a mongoose");
                }
            })
        }
    })
    res.redirect('/');
})


// Setting our Server to Listen on Port: 8000
app.listen(8000, function() {
    console.log("listening on port 8000");
})