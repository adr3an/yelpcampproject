if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}


const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const { campgroundSchema, reviewSchema } = require('./schemas.js');
const Review = require('./models/review');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

const MongoDBStore = require('connect-mongo');


mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log("Database connected");
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());

const secret = process.env.SECRET || 'thisisthesecretkey';

const store = MongoDBStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: secret
    }
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROr!!", e);
});

const sessionConfig = {
    store,
    name: "session",
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() * 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        // secure: true

    }

}

app.use(session(sessionConfig));
app.use(flash());
app.use(helmet({ contentSecurityPolicy: false }));

//must be after session 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
})

app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);



app.get('/', (req, res) => {
    res.render('home');
});




app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found'), 404)
});
app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong' } = err;
    if (!err.message) err.message = 'Oh No, Something went wrong';
    res.status(statusCode).render('error', { err });
})
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on ${port}`);
})

//almost done