const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '607a74d47656643c1c880a2f',
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/adrean123/image/upload/v1618951042/YelpCamp/nn2mv9sbusr03eenz4bf.jpg',
                    filename: 'YelpCamp/nn2mv9sbusr03eenz4bf'
                },
                {
                    url: 'https://res.cloudinary.com/adrean123/image/upload/v1618951045/YelpCamp/r6yoidf9ittvxjcbe7rp.jpg',
                    filename: 'YelpCamp/r6yoidf9ittvxjcbe7rp'
                }
            ],
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]

            },
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel incidunt aut dolores ab repellat animi et distinctio! Sed veniam similique, corporis magnam dolorum quas odio ipsa qui pariatur numquam veritatis?',
            price
        });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});