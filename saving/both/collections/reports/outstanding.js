/**
 * Schema
 */
Saving.Schema.OutstandingReport = new SimpleSchema({
    branch: {
        type: String,
        label: "Branch",
        optional: true,
        autoform: {
            type: "select2",
            options: function () {
                return Saving.ListForReport.branch();
            }
        }
    },
    currency: {
        type: String,
        label: "Currency",
        optional: true,
        autoform: {
            type: "select2",
            options: function () {
                return Saving.ListForReport.currency();
            }
        }
    },
    product: {
        type: String,
        label: "Product",
        optional: true,
        autoform: {
            type: "select2",
            options: function () {
                return Saving.ListForReport.product();
            }
        }
    },
    date: {
        type: String,
        label: "Date"
    },
    exchange: {
        type: String,
        label: "Exchange",
        autoform: {
            type: "select2",
            options: function () {
                return Saving.ListForReport.exchange();
            }
        }
    }
});