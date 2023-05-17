const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { sendConfirmationMail } = require("../utils/utils");
const { isEmail } = require("validator");

const user_schema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: [true, "Please Enter an email"],
    lowercase: true,
    validate: [isEmail, "Please Enter valid email"],
  },

  name: { type: String, required: true },
  password: {
    type: String,
    required: [true, "Please Enter the Password"],
    minlength: [8, "Min Length:8"],
  },
  messages: {
    type: [
      {
        content: { type: String },
        role: { type: String, enum: ["assistant", "user"] , required: true},
        sendingDate: { type: Date, default: Date.now },
      },
    ],
    default: [],
  },
  isConfirmed: { type: Boolean, default: false },
});

user_schema.post("save", (docs, next) => {
  console.log("User is Saved");
  next();
});

user_schema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

user_schema.statics.login = async function (email, password) {
  const user = await this.findOne({ email: email });
  if (user) {
    if (user.isConfirmed === false) {
      // send him the email again
      await sendConfirmationMail(email, user._id);
      throw Error(
        "Please confirm your email, We have sent you a new Confirmation Email"
      );
    }
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    } else {
      throw Error("Incorrect password");
    }
  } else {
    throw Error("User not found");
  }
};
module.exports = mongoose.model("user", user_schema);
