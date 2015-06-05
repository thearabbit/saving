/**
 * Schema
 */
Saving.Schema.HistoryReport = new SimpleSchema({
    account: {
        type: String,
        label: "Account id",
        autoform: {
            type: "select2",
            options: function () {
                return Saving.ListForReport.account();
            }
        }
    }
});