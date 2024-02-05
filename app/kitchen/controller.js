const KitchenRepository = require("./repository");
const repo = new KitchenRepository();
const TableRepository = require("../table/repository");
const tableRepo = new TableRepository();
const ResRepository = require("../rest/repository");
const resRepo = new ResRepository();
const OrderRepository = require("../order/repository");
const orderRepo = new OrderRepository();
const ReservationRepository = require("../reservation/repository");
const ReservRepo = new ReservationRepository();
const Encryption = require("../../lib/helpers/encryption");
const { getJWTToken } = require("../../lib/helpers/auth-helper");
const _ = require("lodash");

const io = require("../../config/socket.io");

/**
 *
 */
exports.edit = async (req, res) => {
  try {
    // FIXME: Check for valid restaurant id
    const rest_id = req.params.id;
    let kitchen = await repo.findOne({ rest_id: rest_id });
    // console.log(kitchen);
    // Create a new Kitchen for this restaurant
    if (!kitchen) {
      if (req.body) {
        const payload = {
          username: req.body.username,
          rest_id: rest_id,
          password: await Encryption.hashPassword(req.body.password),
        };
        await repo.createItem(payload);
        return res.status(200).json({
          msg: "تم إنشاء حساب للمطبخ",
        });
      } else {
        // Default Account
        kitchen = {
          username: `kitchen-${rest_id}`,
          rest_id: rest_id,
          password: await Encryption.hashPassword("12345"),
        };
        await repo.createItem(kitchen);
        return res.status(201).json({
          msg: "Record Created!",
        });
      }
    } else {
      // If information edit was requested
      if (req.body) {
        const payload = {
          username: req.body.username,
          rest_id: rest_id,
          password: await Encryption.hashPassword(req.body.password),
        };
        await repo.updateItem(kitchen._id, payload);
        return res.status(200).json({
          msg: "تم تعديل بيانات المطبخ",
        });
      }
    }
  } catch (err) {
    res.status(401).json({
      msg: "تأكد من البيانات المدخلة",
    });
  }
};

/**
 * ✅
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
exports.login = async (req, res) => {
  try {
    let id = req.params.id;
    // FIXME: check for valid restaurant id
    let { username, password, restaurantName } = req.body;
    const rest = await resRepo.findOne({ username: restaurantName });
    if (!rest) {
      res.status(401).json({ msg: "restaurant not found" });
    }
    // Validate user input
    if (!(username && password))
      return res.status(400).json({
        error: "All input is requried.",
      });
    // User validation
    let kitchen = await repo.findByUsername(username);
    if (!kitchen)
      return res.status(400).json({
        error: "User not found.",
      });
    if (kitchen.rest_id.toString() !== rest._id.toString()) {
      return res.status(401).json({ msg: "اسم المطعم خاطئ" });
    }
    if (
      kitchen &&
      (await Encryption.comparePasswords(password, kitchen.password))
    ) {
      // Create token
      const token = getJWTToken({
        _id: kitchen._id,
        username,
        role: kitchen.role,
      });

      return res.header("x-access-token", token).json({
        restId: rest._id,
        id: kitchen._id,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};

/**
 * Get active Orders .. TO BE TESTED 🧪
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
exports.getOrders = async (req, res) => {
  try {
    let id = req.params.id;
    let orders = await orderRepo.find({
      restaurantId: id,
      status: "sent",
    });
    return res.status(200).json(orders);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};

/**
 * Get Order details
 * @param {*} req
 * @param {*} res
 */
exports.getOrderDetails = async (req, res) => {
  try {
    let { id, oid } = req.params;
    let order = await orderRepo.findById(oid);
    return res.status(200).json({
      order,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};

const status = {
  // 1: 'ordering',
  2: "sent",
  // 3: 'discarded',
  4: "in-kitchen",
  5: "ready",
  6: "served",
};

/**
 * Change Order status
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
exports.changeOrderStatus = async (req, res) => {
  try {
    let { id, oid } = req.params;
    let order = await orderRepo.findById(oid);
    if (order.status === "ready") {
      return res.status(401).json({ msg: "status is already ready" });
    }
    await order.updateOne({
      status: req.body.status,
    });
    order = await orderRepo.findById(oid);
    let reserve = await ReservRepo.findById(order.reservationId);

    if (order.status === "ready") {
      io.getIo()
        .to(reserve.waiter_id.toString())
        .emit(
          "get_order_from_kitchen",
          order.tableNumber
        );
      return res.status(200).json({
        order: _.omit(order.toObject(), [
          "reservationId",
          "restaurantId",
          "createdAt",
          "updatedAt",
          "__v",
        ]),
      });
    }
    return res.status(200).json({ msg: "تم تغيير الحالة" });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};
