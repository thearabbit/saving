// Collection
Saving.Collection.Account = new Mongo.Collection("saving_account");

// Schema
Saving.Schema.Account = new SimpleSchema({
    accDate: {
        type: String,
        label: "Acc Date",
        defaultValue: function () {
            var currentDate = moment(ReactiveMethod.call("currentDate"), 'YYYY-MM-DD H:mm:ss').format('YYYY-MM-DD');
            return currentDate;
        }
    },
    cpanel_currencyId: {
        type: String,
        label: "Currency",
        autoform: {
            type: "select2",
            options: function () {
                return Saving.List.currency();
            }
        }
    },
    productId: {
        type: String,
        label: "Product",
        autoform: {
            type: "select2",
            options: function () {
                return Saving.List.product();
            }
        }
    },
    type: {
        type: String,
        label: "Type",
        autoform: {
            type: "select2",
            options: function () {
                return Saving.List.accType();
            }
        }
    },
    cycle: {
        type: Number,
        label: 'Cycle',
        optional: true
    },
    status: {
        type: String,
        label: "Status",
        max: 200,
        optional: true
    },
    memo: {
        type: String,
        label: "Memo",
        max: 500,
        optional: true
    },
    clientId: {
        type: String,
        label: "Client",
        autoform: {
            type: "select2",
            options: function () {
                return Saving.List.client();
            }
        }
    },
    staffId: {
        type: String,
        label: "Staff",
        autoform: {
            type: "select2",
            options: function () {
                return Saving.List.staff();
            }
        }
    },
    cpanel_branchId: {
        type: String,
        label: "Branch"
    }
});

/**
 * Attach schema
 */
Saving.Collection.Account.attachSchema(Saving.Schema.Account);
