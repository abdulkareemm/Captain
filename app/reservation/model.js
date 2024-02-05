const mongoose = require('mongoose');
const moment = require('moment');

// Reservation Schema 
const ReservationSchema = new mongoose.Schema({
    waiter_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'staff-members'
    },
    reservationStart: Date,
    reservationEnd: Date,
    startHour: Number,
    duration: Number,
    table_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tables'
    },
}, { timestamps: true, },);

// Trigger: validation to make sure the table cannot be double-booked 
ReservationSchema.path('reservationStart').validate(async function (value) {
    // Extract the table id from the query object
    let table_id = this.table_id;
    // Convert reservation Date objects into a number value 
    let newResStart = new Date(value).getTime();
    let newResEnd = new Date(this.reservationEnd).getTime();


    // Function to check for Reservation clash
    let clashesWithExisting = (existingResStart, existingResEnd, newResStart, newResEnd) => {
        // first condition: Make sure the new reservation starts after the existing
        // one is over
        // second condition: make sure the new reservation starts and ends before 
        // an existing reservation starts
        if (newResStart >= existingResStart && newResStart < existingResEnd ||
            existingResStart >= newResStart && existingResStart < newResEnd) {
            throw new Error(
                `Reservation could not be saved. There is a clash with an existing reservation from ${moment(existingResStart).format('HH:mm')} to ${moment(existingResEnd).format('HH:mm on LL')}`
            )
        }

        return false;
    };

    // RETURN 
    const reservations = await Reservation.find({ table_id: table_id, });
    // Loop through each existing reservation and return false if there is no clash 
    return reservations.every(reservation => {
        // Convert existing reservation Date objects into number values 
        let existingResStart_2 = new Date(reservation.reservationStart).getTime();
        let existingResEnd_1 = new Date(reservation.reservationEnd).getTime();
        // Check 
        return !clashesWithExisting(existingResStart_2, existingResEnd_1, newResStart,
            newResEnd
        );
    });


    // A ValidatorError also may have a {reason} property. If an error was thrown in the validator, this property will contain the error that was thrown.
}, `{REASON}`);



const Reservation = mongoose.model('reservations', ReservationSchema);

// export 
module.exports = Reservation;