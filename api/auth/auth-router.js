const router = require('express').Router();
const db = require('../../data/dbConfig');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../../config//secrets');

//finding a user
async function findUser(username) {
    const user = await db('users').where('username', username).first();
    return user;
}

//getting user by id
async function getUserById(id) {
    const user = await db('users').where('id', id).first();
    return user;
}

//adding a user 
async function addUser(user) {
    const [id] = await db('users').insert(user)
    const newUser = getUserById(id)
    return newUser;
}

function getToken(user) {
    const payload = {
        subject: user.id,
        username: user.username
    }
    const options = {
        expiresIn: '1h'
    }
    const secret = secrets.jwtSecret
    return jwt.sign(payload, secret, options) //should generate signature
}

router.post('/register', async(req, res, next) => {
    // res.end('implement register, please!');
    /*
      IMPLEMENT
      You are welcome to build additional middlewares to help with the endpoint's functionality.
      DO NOT EXCEED 2^8 ROUNDS OF HASHING!

      1- In order to register a new account the client must provide `username` and `password`:
        {
          "username": "Captain Marvel", // must not exist already in the `users` table
          "password": "foobar"          // needs to be hashed before it's saved
        }

      2- On SUCCESSFUL registration,
        the response body should have `id`, `username` and `password`:
        {
          "id": 1,
          "username": "Captain Marvel",
          "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
        }

      3- On FAILED registration due to `username` or `password` missing from the request body,
        the response body should include a string exactly as follows: "username and password required".

      4- On FAILED registration due to the `username` being taken,
        the response body should include a string exactly as follows: "username taken".
    */
    try {
        const { username, password } = req.body;
        const user = await findUser(username)
        if (!username || !password) {
            return res.status(400).json({ message: 'username and password required' })
        } else if (user) {
            return res.status(400).json({ message: 'username taken' })
        } else {
            const userPassword = bcrypt.hashSync(req.body.password, 6)
            const addedUser = await addUser({ username: req.body.username, password: userPassword })
            return res.status(200).json(addedUser)
        }
    } catch (err) {
        res.status(400).json({ message: 'username and password required' })
    }
});

router.post('/login', async(req, res) => {
    // res.end('implement login, please!');
    /*
      IMPLEMENT
      You are welcome to build additional middlewares to help with the endpoint's functionality.

      1- In order to log into an existing account the client must provide `username` and `password`:
        {
          "username": "Captain Marvel",
          "password": "foobar"
        }

      2- On SUCCESSFUL login,
        the response body should have `message` and `token`:
        {
          "message": "welcome, Captain Marvel",
          "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
        }

      3- On FAILED login due to `username` or `password` missing from the request body,
        the response body should include a string exactly as follows: "username and password required".

      4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
        the response body should include a string exactly as follows: "invalid credentials".
    */

    try {
        const { username, password } = req.body;
        const user = await findUser(username);
        if (!username || !password) {
            return res.status(400).json({ message: 'username and password required' })
        } else if (user) {
            let checkPass = bcrypt.compareSync(password, user.password);
            if (checkPass) {
                const token = getToken(user)
                return res.status(200).json({ message: `welcome, ${user.username}`, token })

            } else {
                return res.status(400).json({ message: 'invalid credentials' })
            }
        } else {
            return res.status(400).json({ message: 'invalid credentials' })
        }
    } catch (err) {
        res.status(404).json({ message: 'username and password required' })
    }
});

module.exports = router;