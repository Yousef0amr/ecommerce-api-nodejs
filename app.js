require("dotenv/config");
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const authJwt = require('./utils/expressJwt')
const multer = require('multer');
const path = require('path')
const httpStatus = require('./utils/httpStatusText')

const upload = multer();



const productsRouter = require('./routes/products.route');
const usersRouter = require('./routes/users.route');
const categoriesRouter = require('./routes/categories.route');
const ordersRouter = require('./routes/orders.route');
const cartRouter = require('./routes/carts.route');

const app = express();
const PORT = process.env.PORT;
const API_URL = process.env.API_URL;

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use(cors());
app.options('*', cors());


app.use(express.static('public'));


app.use(authJwt);

// upload.array(),
app.use(`${API_URL}/products`, productsRouter);
app.use(`${API_URL}/categories`, categoriesRouter);

app.use(`${API_URL}/users`, usersRouter);

app.use(`${API_URL}/cart`, upload.array(), cartRouter);
app.use(`${API_URL}/orders`, upload.array(), ordersRouter);

app.all('*', (req, res, next) => {
  res.status(404).json({ status: httpStatus.FAIL, message: "This resource doesn't exist" });
})

app.use((error, req, res, next) => {
  res.status(error.statusCode || 500)
    .json({ status: error.httpStatus || httpStatus.ERROR, message: error.message, code: error.statusCode || 500 })
})

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true

}).then(() => {
  console.log('Database is connected');
}).catch((e) => {
  console.log(e);
});

app.listen(PORT, () => {
  console.log('Server is running on port 3000');
});