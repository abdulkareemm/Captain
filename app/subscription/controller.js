const SubscribeRepository = require("./repository");
const repo = new SubscribeRepository();
const { validationResult } = require("express-validator");
const Encryption = require("../../lib/helpers/encryption");
const RestaurantRepository = require("../rest/repository");
const Rrepo = new RestaurantRepository();
const _ = require("lodash");

exports.create = async (req, res) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      errors = errors.array().map((err) => {
        return _.omit(err, ["location", "param"]);
      });
      return res.status(401).json(errors[0]);
    }
    if (await repo.findByEmail(req.body.email)) {
      return res.status(401).json({
        msg: "الايميل موجود مسبقا",
      });
    }
    if (await repo.findByPhone(req.body.phone)) {
      return res.status(401).json({
        msg: "رقم الهاتف موجود مسبقا",
      });
    }
    const payload = {
      name: req.body.name,
      email: req.body.email,
      address: req.body.address,
      phone: req.body.phone,
      note: req.body.Note,
      status: "pending",
    };
    await repo.createItem(payload);
    return res.status(201).json({
      msg: "تم تسجيل الطلب",
    });
  } catch (err) {
    res.status(400).json({
      msg: "تاكد من البيانات المدخلة",
    });
  }
};
exports.list = async (req, res) => {
  try {
    let subscriptions = await repo.find();
    if (subscriptions) {
      return res.status(200).json({
        subscriptions: subscriptions.filter(
          (subscription) => subscription.status === "pending"
        ),
      });
    }
    return res.status(401).json({ msg: "لا يوجد اشتراكات" });
  } catch (err) {
    res.status(401).json({
      msg: "تاكد من البيانات المدخلة",
    });
  }
};
exports.confirm = async (req, res) => {
  try {
    if (!req.body.id) {
      return res.status(400).json({ msg: "تاكد من البيانات المدخلة " });
    }
    let subscripe = await repo.findById(req.body.id);
    if (!subscripe) {
      return res.status(400).json({ msg: "الاشتراك المدخل غير موجود" });
    }
    let restaurant = await Rrepo.findByEmail(subscripe.email);
    if (restaurant) {
      return res.status(400).json({ msg: "تم تاكيد الاشتراك مسبقا" });
    }
    subscripe.status = "accept";
    await repo.updateItem(subscripe._id, subscripe);
    const password = await Encryption.hashPassword(req.body.password);
    const payload = {
      username: req.body.username,
      name: subscripe.name,
      password: password,
      email: subscripe.email,
      address: subscripe.address,
      phone: subscripe.phone,
      expiration_date: req.body.expiration_date,
      role: "restaurant",
    };
    restaurant = await Rrepo.createItem(payload);
    return res.status(201).json({
      msg: "تم تاكيد الاشتراك",
    });
  } catch (err) {
    res.status(401).json({
      msg: "تاكد من البيانات المدخلة",
    });
  }
};
