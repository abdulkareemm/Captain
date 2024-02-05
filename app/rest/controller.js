const RestaurantRepository = require("./repository");
const repo = new RestaurantRepository();
const Encryption = require("../../lib/helpers/encryption");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const { tokenKey } = require("../../config");
const { deleteFile } = require("../../lib/helpers/delete-file");

/**
 *
 */
exports.create = async (req, res) => {
  try {
    // Check confirmation password
    if (req.body.password !== req.body.confirmationPassword) {
      return res.status(400).json({
        msg: "كلمة المرور غير صحيحة",
      });
      // Check if email exists
    } else if (req.body.email && (await repo.findByEmail(req.body.email))) {
      return res.status(400).json({
        msg: "الايميل موجود مسبقا",
      });
      // Check if username exists
    } else if (
      req.body.username &&
      (await repo.findByUsername(req.body.username))
    ) {
      return res.status(400).json({
        msg: "الاسم موجود مسبقا",
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
      expiration_date: req.body.expiration_date,
      role: "restaurant",
    };

    let restaurant = await repo.createItem(payload);
    return res.status(201).json({
      user: _.omit(restaurant.toObject(), ["password"]),
    });
  } catch (err) {
    res.status(400).json({
      msg: "الرجاء التأكد من البيانات المدخلة",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password, rememberMe } = req.body;
    // Validate user input
    if (!(username && password))
      return res.status(400).json({
        msg: "الرجاءادخال البيانات كاملة",
      });
    // User validation
    let restaurant = await repo.findByUsername(username);
    if (!restaurant)
      return res.status(401).json({
        msg: "المطعم غير موجود",
      });
    if (restaurant.active !== true) {
      return res.status(201).json({
        msg: "الحساب متوقف حاليا,يرجى إعادة الاشتراك",
      });
    }
    if (
      restaurant &&
      (await Encryption.comparePasswords(password, restaurant.password))
    ) {
      // Create token
      const token = jwt.sign(
        {
          _id: restaurant._id,
          username,
          role: restaurant.role,
        },
        tokenKey,
        {
          expiresIn: rememberMe ? "2d" : "2h",
        }
      );

      return res.header("x-access-token", token).json({
        restaurant: _.omit(restaurant.toObject(), [
          "password",
          "role",
          "expiration_date",
        ]),
        token: token,
      });
    }
    return res.status(403).json({
      msg: "بيانات خاطئة!",
    });
  } catch (err) {
    res.status(401).json({
      msg: "الرجاء التأكد من البيانات المدخلة",
    });
  }
};
exports.getAll = async (req, res) => {
  try {
    const restaurants = await repo.find({ active: true });
    if (restaurants) {
      return res.status(200).json({
        restaurants: restaurants.map((restaurant) => {
          return _.omit(restaurant.toObject(), [
            "password",
            "username",
            "email",
            "address",
            "phone",
            "role",
            "active",
            "createdAt",
            "updatedAt",
            "__v",
            "expiration_date",
            "workingEnd",
            "workingStart",
          ]);
        }),
      });
    }
    return res.status(201).json({ msg: "لايوجد مطاعم" });
  } catch (err) {
    res.status(400).json({
      error: "أمر خاطئ",
    });
  }
};
exports.list = async (req, res) => {
  try {
    const restaurants = await repo.find();
    if (restaurants) {
      return res.status(200).json({
        restaurants: restaurants.map((restaurant) => {
          return _.omit(restaurant.toObject(), [
            "password",
            "role",
            "createdAt",
            "__v",
          ]);
        }),
      });
    }
    return res.status(201).json({ Msg: "No resturants" });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};
exports.delete = async (req, res) => {
  try {
    let restaurant = await repo.findById(req.body.id);
    if (!restaurant)
      return res.status(400).json({
        error: "Restaurant not found.",
      });
    if (!restaurant.active) {
      return res.status(201).json({
        error: "هذا الحساب تم ايقافه مسبقا",
      });
    }
    restaurant.active = false;
    restaurant.expiration_date = new Date();
    await repo.updateItem(restaurant._id, restaurant);
    return res.status(200).json({
      msg: "تم ايقاف الحساب",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};

exports.active = async (req, res) => {
  try {
    let restaurant = await repo.findById(req.body.id);
    if (!restaurant)
      return res.status(400).json({
        error: "Restaurant not found.",
      });
    if (restaurant.active) {
      return res.status(201).json({
        error: "هذا الحساب تم تفعيله مسبقا",
      });
    }
    restaurant.active = true;
    restaurant.expiration_date = req.body.expiration_date;
    await repo.updateItem(restaurant._id, restaurant);
    return res.status(200).json({
      msg: "تم تفعيل الحساب",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};

exports.edit = async (req, res) => {
  try {
    let restaurant = await repo.findById(req.body.id);
    if (!restaurant) {
      if (req.file) {
        deleteFile(req.file.path.replace("\\", "/"));
      }
      return res.status(401).json({ msg: "المطعم المدخل غير موجود" });
    }
    if (!req.file) {
      return res.status(401).json({ msg: "الرجاء إدخال صورة" });
    }
    const payload = {
      avatar: req.file.path.replace("\\", "/"),
      phone_contact: req.body.phone_contact,
      web_links: req.body.web_links,
      workingStart: req.body.workingStart,
      workingEnd: req.body.workingEnd,
      address: req.body.address,
    };
    if (!restaurant.avatar === "") deleteFile(restaurant.avatar);
    await repo.updateItem(req.body.id, payload);
    return res.status(201).json({ msg: "تم إضافة التعديلات" });
  } catch (err) {
    if (req.file) deleteFile(req.file.path.replace("\\", "/"));
    return res.status(401).json({ msg: "الرجاء التأكد من البيانات المدخلة" });
  }
};

exports.getRestaurant = async (req, res) => {
  try {
    if (!req.body.id) {
      return res.status(401).json({ msg: "تأكد من البيانات المدخلة" });
    }
    const restaurant = await repo.findById(req.body.id);
    if (restaurant) {
      return res.status(200).json({
        restaurant: _.omit(restaurant.toObject(), [
          "password",
          "role",
          "createdAt",
          "updatedAt",
          "__v",
          "username",
          "name",
          "password",
          "email",
          "phone",
          "active",
          "expiration_date",
          "_id",
        ]),
      });
    }
    return res.status(401).json({ msg: "المطعم غير موجود" });
  } catch (err) {
    return res.status(401).json({ msg: "تأكد من البيانات المدخلة" });
  }
};
exports.getResById = async (req, res) => {
  try {
    if (!req.body.id) {
      return res.status(401).json({ msg: "تأكد من البيانات المدخلة" });
    }
    const restaurant = await repo.findById(req.body.id);
    if (restaurant) {
      return restaurant.active
        ? res.status(200).json({
            restaurant: _.omit(restaurant.toObject(), [
              "password",
              "role",
              "createdAt",
              "updatedAt",
              "__v",
              "username",
              "email",
              "active",
            ]),
          })
        : res
            .status(400)
            .json({ msg: "الحساب متوقف حاليا,يرجى إعادة الاشتراك" });
    }
    return res.status(401).json({ msg: "المطعم غير موجود" });
  } catch (err) {
    return res.status(401).json({ msg: "تأكد من البيانات المدخلة" });
  }
};

