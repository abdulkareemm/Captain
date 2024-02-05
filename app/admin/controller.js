const Encryption = require("../../lib/helpers/encryption");
const adminTypes = require("./admin-types");
const AdminRepository = require("./repository");
const repo = new AdminRepository();
const _ = require("lodash");
const jwt = require("jsonwebtoken");

const { tokenKey } = require("../../config");

exports.list = async (req, res) => {
  try {
    let admins = await repo.find();
    return res.status(200).json(admins);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: err,
    });
  }
};

/**
 * Create a new admin
 * ✅
 */
exports.create = async (req, res) => {
  try {
    // Check confirmation password
    if (req.body.password !== req.body.confirmationPassword) {
      return res.status(400).json({
        error: "Passwords do not match!",
      });
      // Check email exists
    } else if (req.body.email && (await repo.findByEmail(req.body.email))) {
      return res.status(400).json({
        error: "Email already registered!",
      });
      // Check username exists
    } else if (
      req.body.username &&
      (await repo.findByUsername(req.body.username))
    ) {
      return res.status(400).json({
        error: "Username already exists",
      });
    }

    const password = await Encryption.hashPassword(req.body.password);
    const payload = {
      username: req.body.username,
      name: req.body.name,
      password: password,
      email: req.body.email,
      address: req.body.address,
      phone: req.body.phone,
      role: "admin",
      adminType: adminTypes[1],
    };

    let admin = await repo.createItem(payload);

    return res.status(201).json({
      user: _.omit(admin.toObject(), ["password"]),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};

/**
 * Login
 * ✅
 * Note: MIGHT NEED TO EDIT 'REMEMBER ME' OPTION
 * @INUSE
 */
exports.login = async (req, res) => {
  try {
    const { username, password, rememberMe } = req.body;
    // Validate user input
    if (!(username && password))
      return res.status(400).json({
        error: "All input is required.",
      });
    // User validation
    let admin = await repo.findByUsername(username);
    if (!admin)
      return res.status(400).json({
        error: "User not found.",
      });
    if (
      admin &&
      (await Encryption.comparePasswords(password, admin.password))
    ) {
      // Create token
      const token = jwt.sign(
        {
          _id: admin._id,
          username,
          role: admin.role,
          adminType: admin.adminType,
        },
        tokenKey,
        {
          expiresIn: rememberMe ? "2d" : "2h",
        }
      );

      // return res.header("x-access-token", token).json({
      //   msg: "Logged in!",token:token
      // })
      //طه ماعم يقدر يوصل للهيدر فعشان التجريب رح ابعتلو ياه بالبودي
      return res.header("x-access-token", token).json({
        token: token,
        admin: _.omit(admin.toObject(), ["password"]),
      });
    }
    return res.status(403).json({
      error: "Password not match",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};
