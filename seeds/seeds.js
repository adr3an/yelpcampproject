const mongoose = require('mongoose');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("Mongo connected");
    })
    .catch(err => {
        console.log(err);
    })

const seedCamps = [
    {
        title: 'My Backyard',
        price: '250,00',
        description: 'This is a cheap Camp',
        location: "USA"
    },
    {
        title: ' USA',
        price: '2500,00',
        description: 'This is an expensive Camp',
        location: "Jamaica"
    },
    {
        title: 'Yellow Stone',
        price: '150,00',
        description: 'This is a Camp',
        location: "Jamaica"
    },
    {
        title: 'Niagra Falls',
        price: '50,00',
        description: 'This is a new Camp',
        location: "Jamaica"
    },
    {
        title: 'Tivoli Gardens',
        price: '350,00',
        description: 'This gangster Camp',
        location: "Jamaica"
    }
]

Campground.insertMany(seedCamps)
    .then(res => {
        console.log(res);
    })
    .catch(e => {
        console.log(e);
    })
