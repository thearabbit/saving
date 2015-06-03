Saving.TabularTable.Withdrawal = new Tabular.Table({
    name: "savingWithdrawalList",
    collection: Saving.Collection.Perform,
    columns: [
        {data: "performDate", title: "Withdrawal Date"},
        //{data: "principalRe", title: "Principal Re"},
        //{data: "interestRe", title: "Interest Re"},
        {
            data: "amount",
            title: "Amount",
            render: function (val, type, doc) {
                return accounting.formatNumber(val, 2);
            }
        },
        {
            data: "principalBal",
            title: "Principal Bal",
            render: function (val, type, doc) {
                return accounting.formatNumber(val, 2);
            }
        },
        {
            data: "interestBal",
            title: "Interest Bal",
            render: function (val, type, doc) {
                return accounting.formatNumber(val, 2);
            }
        },
        {data: "status", title: "Status"},
        {data: "voucherId", title: "Voucher ID"},
        {data: "accountId", title: "Account ID"},
        {
            title: '<i class="fa fa-bars"></i>',
            tmpl: Meteor.isClient && Template.saving_withdrawalAction
        }
    ],
    order: [['0', 'desc'], ['5', 'desc']],
    columnDefs: [
        {"width": "130px", "targets": 6},
        {"width": "12px", "targets": 7}
    ]
});