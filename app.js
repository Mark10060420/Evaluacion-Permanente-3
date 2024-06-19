const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('./public/user')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

const mongo_uri = 'mongodb://localhost:27017/Register';
mongoose.connect(mongo_uri)
    .then(() => {
        console.log(`Successfully connected to ${mongo_uri}`);
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

app.post('/register', (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    const user = new User({ firstName, lastName, email, password });

    user.save()
        .then(() => {
            res.status(200).send('USUARIO REGISTRADO');
        })
        .catch(err => {
            res.status(500).send('ERROR AL REGISTRAR EL USUARIO');
        });
});
app.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            res.status(500).send('El USUARIO NO EXISTE');
        } else {
            user.isCorrectPassword(password, (err, result) => {
                if (err) {
                    res.status(500).send('ERROR AL AUTENTICAR');
                } else if (result) {
                    res.status(200).send('USUARIO AUTENTICADO CORRECTAMENTE');
                } else {
                    res.status(500).send('USUARIO Y/O CONTRASEÑA INCORRECTA');
                }
            });
        }
    } catch (error) {
        res.status(500).send('ERROR AL AUTENTICAR AL USUARIO');
    }
});

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`)
})
app.get('/signup', (req, res) => {
    res.sendFile(`${__dirname}/public/signup.html`)
})

app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});