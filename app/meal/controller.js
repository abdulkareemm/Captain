const MealRepository = require("./repository");
const repo = new MealRepository();
const { isValidId } = require("../../lib/helpers/db/db-helpers");
const { deleteFile } = require("../../lib/helpers/delete-file");

/**
 * ✅ working!
 */
exports.create = async (req, res) => {
  let imageUrl = "";
  req.file ? (imageUrl = req.file.path.replace("\\", "/")) : (imageUrl = "");

  try {
    // Check if the request is sent
    // from a valid restaurant
    if (!isValidId(req.params.id)) {
      deleteFile(imageUrl);
      return res.status(404).json({
        msg: "تأكد من بيانات المطعم المدخلة",
      });
    }
    let categories;
    if (req.body.categories.constructor.name == "Array") {
      categories = req.body.categories;
    } else {
      categories = [req.body.categories];
    }
    for (let i = 0; i < categories.length; i++) {
      if (!isValidId(categories[i])) {
        deleteFile(imageUrl);
        return res.status(400).json({
          msg: "تأكد من بيانات الفئة المدخلة",
        });
      }
    }
    const payload = {
      name: req.body.name,
      description: req.body.description,
      categories: categories,
      price: req.body.price,
      rest_id: req.params.id,
      imageUrl: imageUrl,
    };
    await repo.createItem(payload);
    return res.status(201).json({
      msg: "تم إضافة الوجبة",
    });
  } catch (err) {
    if (imageUrl !== "") deleteFile(imageUrl);
    res.status(404).json({
      msg: "تأكد من البيانات المدخلة",
    });
  }
};

/**
 * Get Meals for current Restaurant
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
exports.getMeals = async (req, res) => {
  try {
    let { id, cid } = req.params;
    let key = req.query;
    let meals = await repo.find({ rest_id: id });
    if (!meals)
      return res.status(200).json({
        msg: "لا توجد وجبات",
      });
    // if (key) {
    //   for(let i = 0;i < meals.length; i++)
    //     meals.remove(meals[i])
    // }
    meals = meals.filter((meal) => {
      return meal.categories.includes(cid);
    });
    return res.status(200).json(meals);
  } catch (err) {
    console.log(err);
    res.status(404).json({
      msg: "تأكد من البيانات المدخلة",
    });
  }
};

/**
 * Get Meal information
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
exports.getMealInfo = async (req, res) => {
  try {
    let { id, mid } = req.params;
    const meal = await repo.findOne({ _id: mid });
    if (!meal)
      return res.status(404).json({
        msg: "Meal not found.",
      });
    return res.status(200).json({
      meal,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};

/**
 * Edit Meal
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
exports.edit = async (req, res) => {
  try {
    let imageUrl = "";
    if (req.file) {
      imageUrl = req.file.path.replace("\\", "/");
    }
    let { id, mid } = req.params;
    let meal = await repo.findOne({ _id: mid });
    if (!meal) {
      if (req.file) {
        deleteFile(imageUrl);
      }
      return res.status(404).json({
        msg: "الوجبة غير موجودة",
      });
    }

    if (!(id === meal.rest_id.toString())) {
      if (req.file) {
        deleteFile(imageUrl);
      }

      return res.status(404).json({
        msg: "تأكد من بيانات المطعم المدخلة",
      });
    }

    const payload = {
      name: req.body.name,
      description: req.body.description,
      categories: req.body.categories,
      price: req.body.price,
      rest_id: req.params.id,
      imageUrl: imageUrl ? imageUrl : meal.imageUrl,
    };
    await repo.updateItem(meal._id, payload);
    if (req.file && meal.imageUrl) {
      deleteFile(meal.imageUrl);
      console.log("asdasd")
    }

    return res.status(200).json({
      msg: "تم تعديل الوجبة",
    });
  } catch (err) {
    if (req.file) {
      const imageUrl = req.file.path.replace("\\", "/");
      deleteFile(imageUrl);
    }
    res.status(404).json({
      msg: "تأكد من البيانات المدخلة",
    });
  }
};

/**
 * delete Meal
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
exports.delete = async (req, res) => {
  try {
    let { id, mid } = req.params;
    let meal = await repo.findOne({ _id: mid });
    if (!meal) {
      return res.status(404).json({
        msg: "الوجبة غير موجودة",
      });
    }

    if (!(id === meal.rest_id.toString())) {
      return res.status(404).json({
        msg: "تأكد من بيانات المطعم",
      });
    }

    deleteFile(meal.imageUrl);
    await repo.deleteItem(meal._id);
    return res.status(200).json({
      msg: "تم حذف الوجبة",
    });
  } catch (err) {
    res.status(400).json({
      msg: "تأكد من البيانات المدخلة",
    });
  }
};
