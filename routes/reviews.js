const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { reviewSchema } = require('../schemas.js');
const Campground = require('../models/campground');
const Review = require('../models/review');
const { isLogged, validateReview } = require('../middleware');
const reviews = require('../controllers/reviews');



router.post("/", isLogged, validateReview, catchAsync(reviews.createReview));

router.delete("/:reviewId", isLogged, catchAsync(reviews.deleteReview));

module.exports = router;