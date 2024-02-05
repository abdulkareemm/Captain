const CategoryRepository = require("./repository");
const repo = new CategoryRepository();
const { isValidId } = require("../../lib/helpers/db/db-helpers");

/**
 * 	✅ working!
 */
exports.create = async (req, res) => {
  try {
    let { id } = req.params;
    // Check if Category exists
    // if (req.body.name && (await repo.findByName(req.body.name)) && (await )) {
    // 	return res.status(400).json({
    // 		error: "Category already exists!",
    // 	});
    // }
    const payload = {
      name: req.body.name,
      rest_id: id,
    };
    await repo.createItem(payload);
    return res.status(201).json({
      msg: "تم إضافة الفئة",
    });
  } catch (err) {
    res.status(400).json({
      msg: "الرجاء التأكد من البيانات المدخلة",
    });
  }
};

/**
 * Get Categories for Restaurant
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
exports.getCategories = async (req, res) => {
  try {
    let { id } = req.params;
    const categories = await repo.find({ rest_id: id });
    if (categories.length === 0)
      return res.status(200).json({
        msg: "لا يوجك فئات ",
      });
    return res.status(200).json(categories);
  } catch (err) {
    res.status(401).json({
      msg: "الرجاء التأكد من البيانات المدخلة",
    });
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.editCategory = async (req, res) => {
  try {
    let { id, cid } = req.params;
    let category = await repo.findById(cid);
    if (!category)
      return res.status(404).json({
        msg: "تحقق من البيانات المدخلة",
      });
    if (!isValidId(id)) {
      return res.status(400).json({
        msg: "تأكد من بيانات المطعم المدخلة",
      });
    }
    if (!(id === category.rest_id.toString())) {
      return res.status(404).json({
        msg: "لا يمكنك القيام بهذه العملية",
      });
    }

    await repo.updateItem(category._id, req.body);
    return res.status(200).json({
      msg: "تم تعديل بيانات الفئة",
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      msg: "تأكد من البيانات المدخلة",
    });
  }
};
