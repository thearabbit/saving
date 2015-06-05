Saving.TabularTable.Client = new Tabular.Table({
    name: "savingClientList",
    collection: Saving.Collection.Client,
    autoWidth: false,
    columnDefs: [
        {"width": "12px", "targets": 0}
    ],
    order: [['1', 'desc']],
    columns: [
        {title: '<i class="fa fa-bars"></i>', tmpl: Meteor.isClient && Template.saving_clientAction},
        {data: "_id", title: "ID"},
        {data: "khName", title: "Kh Name"},
        {data: "enName", title: "En Name"},
        {data: "gender", title: "Gender"},
        {data: "dob", title: "Date of Birth"},
        {data: "idType", title: "ID Type"},
        {data: "idNumber", title: "ID Number"},
        {data: "address", title: "Address"},
        {data: "telephone", title: "Telephone"}
    ]
});