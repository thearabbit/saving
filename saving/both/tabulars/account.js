Saving.TabularTable.Account = new Tabular.Table({
    name: "savingAccountList",
    collection: Saving.Collection.Account,
    pagingType: "full_numbers",
    autoWidth: false,
    columnDefs: [
        {"width": "12px", "targets": 0}
    ],
    order: [['1', 'desc']],
    columns: [
        {title: '<i class="fa fa-bars"></i>', tmpl: Meteor.isClient && Template.saving_accountAction},
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
        {data: "staffId", title: "Staff"}
    ]
});