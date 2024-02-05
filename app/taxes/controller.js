const { isValidId } = require("../../lib/helpers/db/db-helpers");
const TaxesRepository = require("./repository");
const repo = new TaxesRepository();
const _ = require("lodash");

exports.create = async (req, res) => {
  try {
    let rest_id = req.params.id;
    if (!isValidId(rest_id))
      return res.status(400).json({
        msg: "المطعم المدخل غير موجود",
      });
    const tax = await repo.findOne({
      name: req.body.name,
      rest_id: req.params.id,
    });
    if (tax) {
      return res
        .status(401)
        .json({ msg: "لا يمكنك إدخال ضرائب لوجود ضرائب مدخلة مسبقا" });
    }
    let finalvalue = 0;
    if (req.body.type === "ثابتة") {
      finalvalue = req.body.value;
    }
    const payload = {
      rest_id: req.params.id,
      name: req.body.name,
      type: req.body.type,
      value: req.body.value,
      finalvalue: finalvalue,
    };
    await repo.createItem(payload);
    return res.status(201).json({ msg: "تم إضافة الضريبة" });
  } catch (err) {
    res.status(400).json({
      msg: "تأكد من البيانات المدخلة",
    });
  }
};
exports.list = async (req, res) => {
  try {
    let rest_id = req.params.id;
    if (!isValidId(rest_id))
      return res.status(400).json({
        msg: "المطعم المدخل غير موجود",
      });
    const taxes = await repo.find({ rest_id: rest_id });
    res.status(201).json({
      taxes: taxes.map((tax) => {
        return _.omit(tax.toObject(), [
          "finalvalue",
          "createdAt",
          "updatedAt",
          "__v",
          "rest_id",
        ]);
      }),
    });
  } catch (err) {
    res.status(400).json({
      msg: "تأكد من البيانات المدخلة",
    });
  }
};
exports.edit = async (req, res) => {
  try {
    const tax = await repo.findById(req.body.id);
    if (!req.body.name && !req.body.type && !req.body.value) {
      return res.status(400).json({
        msg: "لايمكنك القيام بهذه العملية",
      });
    }
    if (tax.rest_id.toString() !== req.params.id) {
      return res.status(400).json({
        msg: "لايمكنك القيام بهذه العملية",
      });
    }
    if (!tax) {
      return res.status(400).json({
        msg: "لايمكنك القيام بهذه العملية",
      });
    }
    const payload = {
      name: req.body.name ? req.body.name : tax.name,
      type: req.body.type ? req.body.typ : tax.type,
      value: req.body.value ? req.body.value : tax.value,
    };
    await repo.updateItem(tax._id.toString(), payload);
    res.status(201).json({ msg: "تم تعديل بيانات الضريبة" });
  } catch (err) {
    res.status(400).json({
      msg: "تأكد من البيانات المدخلة",
    });
  }
};
exports.delete = async (req, res) => {
  try {
    let rest_id = req.params.id;
    let tax_id = req.body.id;
    if (!tax_id) {
      res.status(401).json({ msg: "تأكد من بيانات الضريبة" });
    }
    (await repo.deleteItem(tax_id))
      ? res.status(201).json({ msg: "تم حذف الضريبة" })
      : res.status(401).json({ msg: "الضريبة غير موجودة" });
  } catch (err) {
    res.status(401).json({ msg: "تأكد من البيانات المدخلة" });
  }
};
