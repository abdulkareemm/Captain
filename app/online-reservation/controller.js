const O_ReservationRepository = require("./repository");
const repo = new O_ReservationRepository();
const { validationResult } = require("express-validator");
const _ = require("lodash");

exports.create = async (req, res) => {
  try {
    const reservation = await repo.find({checkSpam:req.body.checkSpam,status:"pending"});
    if (!(reservation.length===0)) {
      return res.status(401).json({
        msg: "عذرا لقد قمت بطلب حجز مسبقا لايمكن اجراء هذا الحجز ",
      });
    }
    const payload = {
      name: req.body.name,
      phone: req.body.phone,
      numberTable: req.body.numberTable,
      dateOfReservation: req.body.dateOfReservation,
      rest_id: req.body.rest_id,
      checkSpam: req.body.checkSpam,
      note: req.body.note,
    };
    await repo.createItem(payload);
    return res.status(201).json({
      msg: "تم تسجيل الحجز، عزيزي المشترك سيتم التواصل معك",
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({ msg: "تأكد من البيانات المدخلة" });
  }
};
exports.list = async (req, res) => {
  try {
    const onlineResevaion = await repo.find({ rest_id: req.params.id });
    if (onlineResevaion.length === 0) {
      return res.status(401).json({ msg: "لا يوجد حجوزات" });
    }
    return res.status(201).json({ onlineReservaion: onlineResevaion });
  } catch (err) {
    return res.status(401).json({ msg: "تأكد من البيانات المدخلة" });
  }
};
exports.confirm = async (req, res) => {
  try {
    if (!req.body.id) {
      return res
        .status(401)
        .json({ msg: "لايوجد حجز الرجاء التاكد من البيانات المدخلة" });
    }
    const onlineResevaion = await repo.findById(req.body.id);
    if (!onlineResevaion) {
      return res
        .status(401)
        .json({ msg: "لايوجد حجز الرجاء التاكد من البيانات المدخلة" });
    }
    if (onlineResevaion.status === "accept") {
      return res.status(401).json({ msg: "تم تأكيد هذا الحجز مسبقا" });
    }
    onlineResevaion.status = "accept";
    await repo.updateItem(onlineResevaion._id, onlineResevaion);
    return res.status(201).json({ msg: "تم تأكيد الحجز" });
  } catch (err) {
    return res.status(401).json({ msg: "الرجاء التأكد من البيانات المدخلة" });
  }
};
exports.reject = async (req, res) => {
  try {
    const reservation = await repo.findById(req.body.id);
    if (!reservation) {
      return res
        .status(401)
        .json({ msg: "لايوجد حجز تأكد من البيانات المدخلة" });
    }
    reservation.status = "reject";
    await repo.updateItem(reservation._id, reservation);
    return res.status(201).json({ msg: "تم رفض الحجز" });
  } catch (err) {
    return res.status(401).json({ msg: "الرجاء التأكد من البيانات المدخلة" });
  }
};
