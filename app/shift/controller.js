const ShiftRepository = require("./repository");
const StaffRepository = require('../staff/repository');
const repo = new ShiftRepository();
const staffRepo = new StaffRepository();

/**
 * 
 * ✅ working!
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.create = async (req, res) => {
    try {
        if (req.body) {
            let staffMemeber = await staffRepo.findByUsername(req.body.username);
            let payload = {
                rest_id: req.params.id,
                staff_id: staffMemeber._id,
                description: req.body.description,
            };

            await repo.createItem(payload);

            return res.status(201).json({
                msg: 'Shift Created!',
            });
        }
        else
            return res.status(400).json({
                error: 'Bad request! Invalid form.',
            });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err,
        });
    }
};