Saving.TabularTable.Staff = new Tabular.Table({
    name: "savingStaffList",
    collection: Saving.Collection.Staff,
    columns: [
        {data: "_id", title: "ID"},
        {data: "name", title: "Name"},
        {data: "gender", title: "Gender"},
        {data: "dob", title: "Date of Birth"},
        {data: "position", title: "Position"},
        {data: "address", title: "Address"},
        {data: "telephone", title: "Telephone"},
        {
            title: '<i class="fa fa-bars"></i>',
            tmpl: Meteor.isClient && Template.saving_staffAction
        }
    ],
    order: [['0', 'desc']],
    columnDefs: [
        {"width": "12px", "targets": 7}
    ]
});