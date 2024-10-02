const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  city: {
    type: String,
    default: "",
  },
  country: {
    type: String,
    required: true,
  },
});

// userSchema.virtual("id").get(function () {
//   return this._id.toHexString();
// });

// userSchema.set("toJSON", {
//   virtuals: true,
// });

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    // Only hash the password if it's modified
    const hash = await bcrypt.hash(this.password, 10);
    console.log("Hashed password:", hash);
    this.password = hash;
  }
  next();
});

userSchema.methods.isValidPassword = async function (password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
};

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
