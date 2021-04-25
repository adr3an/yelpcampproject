const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const { campgroundSchema } = require('../schemas.js');
const { isLogged, isAuthor, validateCampground } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLogged, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));

router.get('/new', isLogged, campgrounds.renderNewForm);

router.route('/:id')
    .put(isLogged, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.editCampground))
    .delete(isLogged, isAuthor, catchAsync(campgrounds.deleteCampground))
    .get(catchAsync(campgrounds.showPage));

router.get('/:id/edit', isLogged, isAuthor, catchAsync(campgrounds.renderEditForm));



module.exports = router;