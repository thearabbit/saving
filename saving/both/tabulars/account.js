Saving.TabularTable.Account = new Tabular.Table({
    name: "savingAccountList",
    collection: Saving.Collection.Account,
    columns: [
        {data: "_id", title: "ID"},
        {data: "accDate", title: "Acc Date"},
        {data: "cpanel_currencyId", title: "Currency"},
        {data: "productId", title: "Product"},
        //{data: "type", title: "Type"},
        {data: "cycle", title: "Cycle"},
        {
            data: "status",
            title: "Status",
            render: function (val, type, doc) {
                if (val == 'Inactive') {
                    return '<span class="label label-default">' + val + '</span>';
                }
                return '<span class="label label-primary">' + val + '</span>';
            }
        },
        {data: "clientId", title: "Client"},
        {data: "staffId", title: "Staff"},
        {
            title: '<i class="fa fa-bars"></i>',
            tmpl: Meteor.isClient && Template.saving_accountAction
        }
    ],
    order: [['0', 'desc']],
    columnDefs: [
        {"width": "130px", "targets": 0},
        {"width": "12px", "targets": 8}
    ]
});