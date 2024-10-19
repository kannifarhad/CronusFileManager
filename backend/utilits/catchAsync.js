/**
 * @package		Cronus File Manager
 * @author		Farhad Aliyev Kanni
 * @copyright	Copyright (c) 2011 - 2024, Kannifarhad, Ltd. (http://www.kanni.pro/)
 * @license		https://opensource.org/licenses/GPL-3.0
 * @link		http://filemanager.kanni.pro
 **/
const AppError = require("./appError");

const catchAsync = (fn) => (req, res, next) => {
  fn(req, res, next).catch((error) =>
    next(new AppError(`Error while executing code:  ${error?.message}`, 400))
  ); // catch errors and forward to next middleware (error handler)
};

module.exports = catchAsync;
