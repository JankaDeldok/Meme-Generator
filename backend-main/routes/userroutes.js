const UserModel = require("../models/user.model");
const express = require("express");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Get all posts
router.get("/user-data", async (req, res) => {
	const userdata = await UserModel.find();
	res.send(userdata);
});

router.post('/users/login', async (req, res) => {
	const users = await User.find();
	var user;
	for (var i = 0; i < users.length; i++){
		if (users[i].email == req.body.loginEmail){
			user = users[i];
			console.log(user);
		}
	}
	if (user == null) {
		return res.json({ status: 'error', error: 'Invalid login' })
	}
	const isPasswordValid = await bcrypt.compare(
		req.body.loginPassword,
		user.password
	)

	if (isPasswordValid) {
		const token = jwt.sign(
			{
				name: user.name,
				email: user.email,
			},
			'secret123'
		)
		return res.json({ status: 'ok', user: token })
	} else {
		return res.json({ status: 'error', user: false })
	}
});

router.post('/users/register', async (req, res) => {
	console.log(req.body)
	try {
		const newPassword = await bcrypt.hash(req.body.password, 10);
		var user = await User.create({
			name: req.body.name,
			email: req.body.email,
			password: newPassword,
		});
		console.log(user);
		res.json({ status: 'ok'});
	}
	catch (err) {
		console.log('error');
		res.json({ status: 'error', error: 'Duplicate email'});
	}
});

module.exports = router;