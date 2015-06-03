Saving.TabularTable.Product = new Tabular.Table({
    name: "savingProductList",
    collection: Saving.Collection.Product,
    columns: [
        {data: "_id", title: "ID"},
        {data: "name", title: "Name"},
        {data: "rate", title: "Rate"},
        {
            title: '<i class="fa fa-bars"></i>',
            tmpl: Meteor.isClient && Template.saving_productAction
        }
    ],
    order: [['0', 'desc']],
    columnDefs: [
        {"width": "12px", "targets": 3}
    ]
});