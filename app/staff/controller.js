const { getJWTToken } = require("../../lib/helpers/auth-helper");
const Encryption = require("../../lib/helpers/encryption");
const StaffRepository = require("./repository");
const repo = new StaffRepository();
const KichenRepository = require("../kitchen/repository");
const kitchenRepo = new KichenRepository();
const ResRepository = require("../rest/repository");
const resRepo = new ResRepository();
const _ = require("lodash");

/**
 *
 */
exports.create = async (req, res) => {
  try {
    let { id } = req.params;
    // Check confirmation password
    if (req.body.password !== req.body.confirmationPassword) {
      return res.status(400).json({
        error: "Passwords do not match",
      });
      // Check if email exists
    } else if (req.body.email && (await repo.findByEmail(req.body.email))) {
      return res.status(400).json({
        error: "Email already registered!",
      });
      // Check if username exists
    } else if (
      req.body.username &&
      (await repo.findByUsername(req.body.username))
    ) {
      return res.status(400).json({
        error: "Username already exists!",
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
      rest_id: id,
      type: "waiter",
      role: "staff",
    };

    let staffMember = await repo.createItem(payload);
    return res.status(201).json({
      user: staffMember,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};

/**
 * ✅
 */
exports.login = async (req, res) => {
  try {
    const { username, password, restaurantName } = req.body;
    if (!restaurantName) {
      res.status(401).json({ msg: "أدخل اسم المطعم" });
    }

    const rest = await resRepo.findOne({ username: restaurantName });
    console.log(rest);
    if (!rest) {
      res.status(401).json({ msg: "restaurant not found" });
    }
    // Validate user input
    if (!(username && password))
      return res.status(400).json({
        error: "All input is required.",
      });
    // User validation
    let user = await repo.findByUsername(username);
    if (!user)
      return res.status(400).json({
        error: "User not found.",
      });
    if (user.rest_id.toString() !== rest._id.toString()) {
      return res.status(401).json({ msg: "اسم المطعم خاطئ" });
    }
    if (user && (await Encryption.comparePasswords(password, user.password))) {
      //Create token
      const token = getJWTToken({
        _id: user._id,
        username,
        role: user.role,
        type: user.type,
      });
      return res.status(200).json({
        user: _.omit(user.toObject(), ["password"]),
        token: token,
        restId: rest._id,
      });
    } else {
      return res.status(400).json({ msg: "password not correct" });
    }
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
};
exports.getAllEmployers = async (req, res) => {
  try {
    rest_id = req.params.id;
    const staff = await repo.find({ rest_id: rest_id });
    const kitchen = await kitchenRepo.findOne({ rest_id: rest_id });
    return res.status(201).json({
      waiters: staff.map((staf) => {
        return _.omit(staf.toObject(), [
          "password",
          "role",
          "createdAt",
          "__v",
          "updatedAt",
          "rest_id",
          "type",
        ]);
      }),
      kitchen: _.omit(kitchen.toObject(), [
        "password",
        "createdAt",
        "__v",
        "updatedAt",
        "rest_id",
        "role",
      ]),
    });
  } catch (err) {
    return res.status(404).json({ msg: "تأكد من البيانات المدخلة" });
  }
};
exports.deleteWaiter = async (req, res) => {
  try {
    const waiter = await repo.findById(req.body.id);
    if (!waiter) {
      return res.status(401).json({ msg: "الموظف المدخل غير موجود" });
    }
    if (waiter.rest_id.toString() !== req.params.id) {
      return res.status(401).json({ msg: "لايمكنك القيام بهذه العملية" });
    }
    await repo.deleteItem(waiter._id);
    return res.status(201).json({ msg: "تم حذف الموظف" });
  } catch (err) {
    return res.status(404).json({ msg: "تأكد من البيانات المدخلة" });
  }
};
