const fs = require("fs");
const path = require("path");

const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const validator = require("validator");

const checkValidationError = (req, validation_error_message) => {
  // Check if there's any validation error that was creatd using express-validator
  // Throw error if any

  error = validationResult(req);
  if (!error.isEmpty()) {
    const newError = new Error(validation_error_message);
    newError.details = error.array();
    newError.statusCode = 422;
    throw newError;
  }
};

const replaceBackslashWithSlash = (string) => {
  return string.replace(/\\/g, "/");
};

const getJWTToken = (email, userId) => {
  const token = jwt.sign(
    {
      email: email,
      userId: userId.toString(),
    },
    process.env.JSON_WEB_TOKEN_SECRET_KEY,
    { expiresIn: "1h" }
  );

  return token;
};

const throwErrorIfNotAuthenticated = (isAuthenticated) => {
  if (!isAuthenticated) {
    const error = new Error("Not authenticated!");
    error.code = 401;
    throw error;
  }
};

const checkValidInputForPost = (postInput) => {
  const errors = [];
  if (
    validator.isEmpty(postInput.title) ||
    !validator.isLength(postInput.title, { min: 5 })
  ) {
    errors.push({ message: "Title is invalid." });
  }
  if (
    validator.isEmpty(postInput.content) ||
    !validator.isLength(postInput.content, { min: 5 })
  ) {
    errors.push({ message: "Content is invalid." });
  }
  if (errors.length > 0) {
    const error = new Error("Invalid input.");
    error.data = errors;
    error.code = 422;
    throw error;
  }
};

const checkValidInputForUser = (userInput) => {
  const errors = [];
  if (!validator.isEmail(userInput.email)) {
    errors.push({
      message: "Email is invalid. Please input a valid email address",
    });
  }
  if (!validator.isLength(userInput.password, { min: 5 })) {
    errors.push({
      message: "Password length is too short. Minimum of 5 characters.",
    });
  }
  if (validator.isEmpty(userInput.name)) {
    errors.push({ message: "Name cannot be empty." });
  }
  if (errors.length > 0) {
    const error = new Error("Invalid Input");
    error.data = errors;
    error.code = 422;
    throw error;
  }
};

exports.checkValidationError = checkValidationError;
exports.replaceBackslashWithSlash = replaceBackslashWithSlash;
exports.getJWTToken = getJWTToken;
exports.throwErrorIfNotAuthenticated = throwErrorIfNotAuthenticated;
exports.checkValidInputForPost = checkValidInputForPost;
exports.checkValidInputForUser = checkValidInputForUser;
