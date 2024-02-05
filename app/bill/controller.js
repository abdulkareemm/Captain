const BillRepository = require("./repository");
const repo = new BillRepository();

const OrderRepository = require("../order/repository");
const orderRepo = new OrderRepository();

const MealRepository = require("../meal/repository");
const mealRepo = new MealRepository();

const TaxesRepository = require("../taxes/repository");
const taxRepo = new TaxesRepository();

const TableRepository = require("../table/repository");
const tableRepo = new TableRepository();

const ReservationRepository = require("../reservation/repository");
const resleRepo = new ReservationRepository();

const StaffRepository = require("../staff/repository");
const staffRepo = new StaffRepository();
const _ = require("lodash");

/**
 * ✅
 * @param {ObjectId} reservationId
 * @returns Bill
 */
exports.getBill = async (reservationId, rest_id) => {
  try {
    // Get all orders for the desired reservation
    const orders = await orderRepo.find({ reservationId: reservationId });
    //Get all taxes in retaurant
    const taxes = await taxRepo.find({ rest_id: rest_id });
    // Calculate total cost for every order
    const rsv = await resleRepo.findById(reservationId);
    const waiter = await staffRepo.findById(rsv.waiter_id);
    console.log(waiter);
    const table = await tableRepo.findById(rsv.table_id);
    console.log(table);
    let dishes = [],
      taxArray = [],
      total = 0,
      taxTotal = 0;
    // If there are no orders
    if (orders.length == 0) {
      total = 100;
    }
    // FIXME: handle second order with same meal name
    for (const order of orders) {
      for (const dish of order.items) {
        // Get Meal
        const meal = await mealRepo.findById(dish.mealId.toString());
        // Add Meal to Bill
        dishes.push({
          mealName: meal.name,
          mealPrice: meal.price,
          quantity: dish.quantity,
          total: meal.price * dish.quantity,
        });
        // Add to total
        total += meal.price * dish.quantity;
      }
    }
    //Calculate Taxes
    taxes.map((tax) => {
      if (tax.type === "ثابتة") {
        taxArray.push({
          name: tax.name,
          value: tax.value,
        });
        taxTotal += tax.value;
      } else {
        taxArray.push({
          name: tax.name,
          value: tax.value * total,
        });
        taxTotal += tax.value * total;
      }
    });
    total += taxTotal;
    // Create bill
    let bill = {
      dishes,
      total: Math.round(total),
      reservationId,
      taxes: taxArray,
      waiterName: waiter.username,
      tableNumber: table.serialNo,
      rest_id: rest_id,
    };
    let b = await repo.createItem(bill);
    return b;
  } catch (err) {
    console.log(err);
  }
};

exports.list = async (req, res) => {
  try {
    let pageNumber = req.body.pageNumber ? req.body.pageNumber : 0;
    if (pageNumber < 0) {
      res.status(401).json({ msg: "تأكد من رقم الصفحة المعطاة" });
    }
    const bills = await repo.getAllBillSorted(req.params.id, pageNumber);
    const count = await repo.getCountDoc(req.params.id);
    res.status(200).json({
      bills: bills.map((bill) => {
        return _.omit(bill.toObject(), [
          "dishes",
          "discount",
          "taxes",
          "reservationId",
          "createdAt",
          "updatedAt",
          "__v",
          "rest_id",
        ]);
      }),
      count: count,
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      msg: "تأكد من البيانات المدخلة",
    });
  }
};
exports.billDetails = async (req, res) => {
  try {
    const bill = await repo.findById(req.params.bid);
    res.status(200).json({
      bill: _.omit(bill.toObject(), [
        "reservationId",
        "createdAt",
        "updatedAt",
        "__v",
        "rest_id",
        "_id",
      ]),
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      msg: "تأكد من البيانات المدخلة",
    });
  }
};
