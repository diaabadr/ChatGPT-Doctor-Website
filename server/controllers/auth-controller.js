const jwt = require("jsonwebtoken");
const User = require("../Models/user.js");
const { sendConfirmationMail } = require("../utils/utils");
const {confirmationPageHtml} = require("../utils/statics");
const day = 1000 * 24 * 60 * 60;
const createToken = function (id) {
  return jwt.sign({ id }, process.env.SECRET, { expiresIn: 3 * day });
};

const signup = async function (req, res) {
  const { name, email, password } = req.body;
  try {
    const user = await User.create({
      name,
      email,
      password,
    });
    if (user) {
      //send an email to him
      sendConfirmationMail(email, user._id);
      res.status(201).json({
        message:
          "Please check your email for a confirmation message and click the verification link before logging in.",
      });
    }
  } catch (error) {
    console.log(error);
    if (error.code === 11000)
      res.status(400).json({ error: "This email already registered" });
    else
      res.status(400).json({
        error:
          error.errors?.email?.properties.message ||
          error.errors?.password?.properties.message,
      });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { maxAge: 3 * day });

    res.status(200).json({ token: token });
  } catch (errors) {
    console.log(errors);
    res.status(400).json({ error: errors.message });
  }
};

const confirmation = async function (req, res, next) {
  User.updateOne(
    { _id: req.params.id },
    { $set: { isConfirmed: true } },
    (err, result) => {
      if (err) res.status(404).json({ error: "Wrong Confirmation Link" });
      
      else { res.setHeader('Content-Type', 'text/html');
      res.write(confirmationPageHtml);
      res.end();
    }
    }
  );
};


module.exports = { signup, login, confirmation };
