/**
 * @package		Cronus File Manager
 * @author		Farhad Aliyev Kanni
 * @copyright	Copyright (c) 2011 - 2019, Kannifarhad, Ltd. (http://www.kanni.pro/)
 * @license		https://opensource.org/licenses/GPL-3.0
 * @link		http://filemanager.kanni.pro
**/

const express = require('express');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const app = express();
const port = 3131
const AppError = require('./utilits/appError');
const globalErrorHandler = require('./controllers/errorController');

//Gathering Routes that used
var fileManager = require('./routes/fileManager');

app.use(cors());
app.use(bodyParser.json({limit: '10mb'}));
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: '50mb'
  })
);
app.use(xss());
app.set('trust proxy', 1);
const limiter = rateLimit({
  max: 1000,
  windowMs: 1 * 60 * 1000,
  message: new AppError(`Too many requests from this IP, please try again in an 1 minutes`, 429)
});

app.use('*', limiter);

app.use('/admin/fm', fileManager);
app.use('/admin/uploads', express.static(__dirname + '/uploads'));

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});