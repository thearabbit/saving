// Collection
Saving.Collection.Perform = new Mongo.Collection("saving_perform");

// Schema
Saving.Schema.Perform = new SimpleSchema({
    performDate: {
        type: String,
        label: "Active Date",
        defaultValue: function () {
            var currentDate = moment(ReactiveMethod.call("currentDate"), 'YYYY-MM-DD H:mm:ss').format('YYYY-MM-DD');
            return currentDate;
        },
        custom: function () {
            // Get last
            var getLast = lastPerformExcept(this.field('accountId').value);
            if (!_.isUndefined(getLast)) {
                if (this.value < getLast.performDate) {
                    return "performDateIsGte";
                }
            }
        }
    },
    dayNumber: {
        type: Number,
        optional: true
    },
    principalRe: {
        type: Number,
        decimal: true,
        optional: true
    },
    interestRe: {
        type: Number,
        decimal: true,
        optional: true
    },
    amount: {
        type: Number,
        label: "Amount",
        decimal: true
    },
    principalBal: {
        type: Number,
        decimal: true,
        optional: true
    },
    interestBal: {
        type: Number,
        decimal: true,
        optional: true
    },
    status: {
        type: String,
        optional: true
    },
    voucherId: {
        type: String,
        label: "Voucher ID",
        max: 50
        //custom: function () {
        //    if (this.value !== this.field('password').value) {
        //        return "voucherIdIsUnique";
        //    }
        //}
    },
    accountId: {
        type: String,
        label: "Account ID"
    },
    cpanel_branchId: {
        type: String
    }
});

/**
 * Attach schema
 */
Saving.Collection.Perform.attachSchema(Saving.Schema.Perform);

/**
 * Errors message
 */
SimpleSchema.messages({
    "performDateIsGte": "This field must be granter than or equal the last doc.",
    "voucherIdIsUnique": "This field is unique."
});
