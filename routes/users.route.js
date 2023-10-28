const express = require('express');
const usersController = require('../controllers/users.controller')
const authController = require('../controllers/auth.controller')
const router = express.Router();


router.route('/')
    .get(usersController.get_users)

router.route('/:id')
    .get(usersController.get_user)
    .patch(usersController.update_user)
    .delete(usersController.delete_user);

router.route('/login')
    .post(authController.login);

router.route('/register')
    .post(authController.register)


module.exports = router;