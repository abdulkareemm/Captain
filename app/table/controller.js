const { isValidId } = require("../../lib/helpers/db/db-helpers");
const TableRepository = require("./repository");
const repo = new TableRepository();
const _ = require("lodash");
const StaffRepository = require("../staff/repository");
const staffRepo = new StaffRepository();
const KitchenRepository = require("../kitchen/repository");
const kitchenRepo = new KitchenRepository();
const MealRepository = require("../meal/repository");
const mealRepo = new MealRepository();
const ItemsRepository = require("../items/repository");
const itemsRepo = new ItemsRepository();
const io = require("../../config/socket.io");

// const StaffRepository = require('../staff/repository');
// const staffRepo = new StaffRepository();

const ReservationRepository = require("../reservation/repository");
const resvRepo = new ReservationRepository();

const OrderRepository = require("../order/repository");
const orderRepo = new OrderRepository();

const moment = require("moment");
const momentTimezone = require("moment-timezone");
const { getBill } = require("../bill/controller");

const CartRepository = require("../item-cart/repository");
const cartRepo = new CartRepository();

/**
 * TESTED ✅
 */
exports.edit = async (req, res) => {
  try {
    // Check if restaurant id is valid
    let rest_id = req.params.id;
    if (!isValidId(rest_id))
      return res.status(400).json({
        error: "Restaurant id is invalid.",
      });
    if (req.body.number && req.body.number > 0) {
      // If Restaurant does NOT have any tables
      // Add a new Table with serialNo 1
      for (i = 0; i < req.body.number; i++) {
        let tables = await repo.findByRestaurantId(rest_id);
        if (!tables) {
          await repo.createItem({
            rest_id,
            serialNo: 1,
          });
        } else {
          await repo.createItem({
            rest_id,
            serialNo: tables.length + 1,
          });
        }
      }
      return res.status(201).json({
        msg: "تم إضافة الطاولات",
      });
    } else {
      let tables = await repo.findByRestaurantId(rest_id);
      if (Math.abs(req.body.number) > tables.length) {
        return res
          .status(401)
          .json({ msg: "الرقم المدخل اكبر من عدد الطاولات" });
      }
      for (
        i = tables.length;
        i >= tables.length - Math.abs(req.body.number);
        i--
      ) {
        await repo.deleteItem(tables[i]);
      }
      return res.status(201).json({ msg: "تم حذف الطاولات" });
    }
  } catch (err) {
    res.status(400).json({
      msg: "تأكد من البيانات المدخلة",
    });
  }
};

/**
 *
 * @param {Request} req
 * @param {Response} res
 */
exports.getTables = async (req, res) => {
  try {
    let rest_id = req.params.id;
    const tables = await repo.findByRestaurantId(rest_id);
    res.status(200).json(
      tables.map((table) => {
        return _.omit(table.toObject(), [
          "createdAt",
          "updatedAt",
          "currentReservation",
          "__v",
        ]);
      })
    );
  } catch (err) {
    res.status(400).json({
      msg: "تأكد من البيانات المدخلة",
    });
  }
};

/**
 *
 * @transactional
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
exports.reserveTable = async (req, res) => {
  try {
    let { tid, sid, id } = req.params;

    // TODO: Validate fields
    let { reservationStart, reservationEnd } = req.body;

    // FIXME: This should be deleted and instead (req.user)
    // Middleware required!!
    // let waiter = await staffRepo.findById(sid);

    // Check if reservation start is 'now'!!

    if (!reservationStart) reservationStart = new Date();

    let rsv = await resvRepo.createItem({
      table_id: tid,
      // waiter: waiter,
      reservationStart: reservationStart,
      reservationEnd: reservationEnd,
      startHour: dateEEST(reservationStart).format("HH.mm"),
      duration: calDuration(reservationStart, reservationEnd),
      waiter_id: sid,
    });
    console.log(rsv);
    let status = reservationEnd ? "reserved" : "busy";

    await repo.updateItem(tid, {
      status: status,
      currentReservation: status == "busy" ? rsv : null,
    });
    let rest_id = req.params.id;
    const tables = await repo.findByRestaurantId(rest_id);
    const staffs = await staffRepo.find({ rest_id: id });
    staffs.map((staff) => {
      //console.log(staff._id.toString());
      io.getIo().to(staff._id.toString()).emit("state_tables", tables);
    });
    return res.status(200).json({
      msg: "Done.",
      reservationId: rsv._id,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};

/**
 * @TRANSACTIONAL
 * @param {Request} req
 * @param {Response} res
 */
exports.closeTable = async (req, res) => {
  try {
    const { id, sid, tid } = req.params;
    let table = await repo.findById(tid);
    let rsEnd = new Date();

    if (table.status == "busy") {
      let rsv = await resvRepo.findById(table.currentReservation.toString());
      let rsvPayload = {
        reservationEnd: rsEnd,
        duration: calDuration(rsv.reservationStart, rsEnd),
      };

      await resvRepo.updateItem(
        table.currentReservation.toString(),
        rsvPayload
      );
      await repo.updateItem(table._id, {
        status: "available",
        currentReservation: null,
      });
      let rest_id = req.params.id;
      const tables = await repo.findByRestaurantId(rest_id);
      const staffs = await staffRepo.find({ rest_id: id });
      staffs.map((staff) => {
        io.getIo().to(staff._id.toString()).emit("state_tables", tables);
      });
      return res.status(200).json({ msg: "تم غلق الطاولة " });
    }
    return res.status(400).json({
      error: `Table is currently ${table.status}`,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};

/**
 * @transactional
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
exports.order = async (req, res) => {
  try {
    const { id, sid, tid } = req.params;
    let table = await repo.findById(tid);
    const { reservationId, notes, items } = req.body;
    if (!items || items.length === 0) {
      res.status(400).json({ msg: "الطلب فارغ,تأكد من البيانات " });
    }
    let itemsR = req.body.items.map((item) => {
      return item.mealName;
    });
    if (itemsR.length > 2) {
      const sameItem = await itemsRepo.findOne({ item: itemsR, rest_id: id });
      if (sameItem) {
        await sameItem.updateOne({ counter: sameItem.counter + 1 });
      } else {
        const sameNumberItems = await itemsRepo.find({
          numberItems: itemsR.length,
          rest_id: id,
        });
        if (sameNumberItems.length > 0) {
          const same = sameNumberItems.filter((items) => {
            return items.item.every((element) => {
              return itemsR.includes(element);
            });
          });
          if (same.length > 0) {
            await same[0].updateOne({ counter: same[0].counter + 1 });
          } else {
            let items = {
              item: itemsR,
              numberItems: itemsR.length,
              counter: 1,
              rest_id: id,
            };
            await itemsRepo.createItem(items);
          }
        } else {
          let items = {
            item: itemsR,
            numberItems: itemsR.length,
            counter: 1,
            rest_id: id,
          };
          await itemsRepo.createItem(items);
        }
      }
      const sameNumberItems = await itemsRepo.find({
        numberItems: {
          $gte: itemsR.length + 1,
          $lt: itemsR.length + 3,
        },
        rest_id: id,
      });
      let differences = [];
      if (sameNumberItems.length !== 0) {
        const same = sameNumberItems.map((item) => {
          return itemsR.every((element) => {
            return item.item.includes(element);
          })
            ? item
            : false;
        });
        differences = same[0].item.filter((x) => itemsR.indexOf(x) === -1);
      }
      let returnItems = [];
      if (differences.length !== 0) {
        let order = await orderRepo.createItem({
          items: items,
          reservationId,
          restaurantId: id,
          tableNumber: table.serialNo,
          notes,
        });
        let oid = order._id;
        await Promise.all(
          differences.map(async (difference) => {
            let meal = await mealRepo.findByName(difference);
            returnItems.push({
              _id: meal._id,
              name: meal.name,
              imageUrl: meal.imageUrl,
              price: meal.price,
              description: meal.description,
              categories: meal.categories,
              rest_id: meal.rest_id,
              oid: oid,
            });
          })
        );
        return res.status(201).json(returnItems);
      }
    }

    let order1 = await orderRepo.createItem({
      items: items,
      reservationId,
      restaurantId: id,
      tableNumber: table.serialNo,
      notes,
    });

    const kitchen1 = await kitchenRepo.findOne({ rest_id: id });
    order1 = _.omit(order1.toObject(), [
      "reservationId",
      "restaurantId",
      "createdAt",
      "updatedAt",
      "__v",
    ]);
    console.log(order1._id);
    io.getIo().to(kitchen1._id.toString()).emit("orderToKitchen", order1);
    return res.status(200).json({
      msg: "Record created",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};
exports.editOrder = async (req, res) => {
  try {
    const { id, sid, tid } = req.params;
    let table = await repo.findById(tid);
    const { notes, items, oid } = req.body;
    const order = await orderRepo.findById(oid);
    console.log("1")
    if (items.length > 0) {
      await Promise.all(
        items.map(async (item) => {
          await orderRepo.updateItems(oid, item);
        })
      );
      
      if (notes) {
        await orderRepo.updateNote(oid, notes);
      }

      const order = await orderRepo.findById(oid);

      const kitchen1 = await kitchenRepo.findOne({ rest_id: id });
      let order1 = _.omit(order.toObject(), [
        "reservationId",
        "restaurantId",
        "createdAt",
        "updatedAt",
        "__v",
      ]);
      console.log(order._id);
      io.getIo().to(kitchen1._id.toString()).emit("orderToKitchen", order1);
      return res.status(200).json({
        msg: "Record created",
      });
    }
    const kitchen1 = await kitchenRepo.findOne({ rest_id: id });
    let order1 = _.omit(order.toObject(), [
      "reservationId",
      "restaurantId",
      "createdAt",
      "updatedAt",
      "__v",
    ]);
    console.log(order._id);
    io.getIo().to(kitchen1._id.toString()).emit("orderToKitchen", order1);
    return res.status(200).json({
      msg: "Record created",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getTablesCount = async (req, res) => {
  try {
    let { id } = req.params;
    let tables = await repo.find({ rest_id: id });
    if (!tables)
      return res.status(404).json({
        msg: "No tables found.",
      });
    return res.status(200).json({
      tablesCount: tables.length,
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
};
exports.getBillToTable = async (req, res) => {
  try {
    const { id, sid, tid } = req.params;
    let table = await repo.findById(tid);
    console.log(table);

    if (table.status == "busy") {
      console.log("run");

      let bill = await getBill(table.currentReservation.toString(), id);
      return res
        .status(200)
        .json(
          _.omit(bill.toObject(), [
            "discount",
            "_id",
            "createdAt",
            "updatedAt",
            "__v",
            "waiterName",
            "tableNumber",
            "reservationId",
            "rest_id",
          ])
        );
    }
    return res.status(400).json({ msg: "error" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ msg: "error" });
  }
};
/**
 * ✅
 * Convert UTC JS Date object to a Moment.js object in EEST
 * @param {Date} date
 * @returns
 */
const dateEEST = (date) => {
  return momentTimezone(date).tz("Asia/Damascus");
};

/**
 * TESTED ✅
 * Calculate duration from start to end
 * @param {Date} resStart
 * @param {Date} resEnd
 * @returns
 */
const calDuration = (resStart, resEnd) => {
  let resStartLocal = dateEEST(resStart);
  let resEndLocal = dateEEST(resEnd);
  // Calculate duration from start to end
  let duration = moment.duration(resEndLocal.diff(resStartLocal));
  // Return difference in decimal format
  return duration.hours() + duration.minutes() / 60;
};
