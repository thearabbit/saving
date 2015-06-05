Saving.TabularTable.Withdrawal = new Tabular.Table({
    name: "savingWithdrawalList",
    collection: Saving.Collection.Perform,
    autoWidth: false,
    columnDefs: [
        {"width": "12px", "targets": 0}
    ],
    order: [['1', 'desc']],
    columns: [
        {title: '<i class="fa fa-bars"></i>', tmpl: Meteor.isClient && Template.saving_withdrawalAction},
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
        {data: "accountId", title: "Account ID"}
    ]
});