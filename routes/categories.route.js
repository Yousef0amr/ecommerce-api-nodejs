const express = require('express');
const categoriesController = require('../controllers/categories.controller')

const router = express.Router();
const multer = require('multer')
const { storage, fileFilter } = require('../utils/uploadFile')


const upload = multer({ storage: storage, fileFilter })

router.route('/')
    .get(categoriesController.get_categories)
    .post(upload.single('image'), categoriesController.add_category)

router.route('/:id')
    .get(categoriesController.get_category)
    .patch(categoriesController.update_category)
    .delete(categoriesController.delete_category)

router.route('/get/count')
    .get(categoriesController.get_count_of_categories)

module.exports = router;