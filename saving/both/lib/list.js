/**
 * List
 */
Saving.List = {
    gender: function () {
        var list = [];
        list.push({label: "(Select One)", value: ""});
        list.push({label: 'Male', value: 'M'});
        list.push({label: 'Female', value: 'F'});

        return list;
    },
    genderNoSelectOne: function () {
        var list = [];
        list.push({label: 'Male', value: 'M'});
        list.push({label: 'Female', value: 'F'});

        return list;
    },
    idType: function () {
        var list = [];
        list.push({label: "(Select One)", value: ""});
        list.push({label: 'National ID', value: 'N'});
        list.push({label: 'Family Book', value: 'F'});
        list.push({label: 'Passport', value: 'P'});
        list.push({label: 'Drivers Licence', value: 'D'});
        list.push({label: 'Government Issued Id', value: 'G'});
        list.push({label: 'Birth Certificate', value: 'B'});
        list.push({label: 'Resident Book', value: 'R'});
        list.push({label: 'Other', value: 'O'});

        return list;
    },
    currency: function () {
        var list = [];
        list.push({label: "(Select One)", value: ""});

        Cpanel.Collection.Currency.find()
            .forEach(function (obj) {
                list.push({label: obj._id + ' (' + obj.num + ')', value: obj._id})
            });

        return list;
    },
    product: function () {
        var list = [];
        list.push({label: "(Select One)", value: ""});

        Saving.Collection.Product.find({}, {sort: {_id: 1}})
            .forEach(function (obj) {
                list.push({
                    label: obj._id + ' | ' + obj.name + ' [' + obj.rate + ']',
                    value: obj._id
                })
            });

        return list;
    },
    accType: function () {
        var list = [];
        list.push({label: "(Select One)", value: ""});
        list.push({label: 'Single', value: 'S'});
        //list.push({label: 'Join', value: 'J'});

        return list;
    },
    position: function () {
        var list = [];
        list.push({label: "(Select One)", value: ""});
        list.push({label: 'Saving Office', value: 'SO'});

        return list;
    },
    staff: function () {
        var list = [];
        list.push({label: "(Select One)", value: ""});

        var selector = {cpanel_branchId: Session.get('currentBranch')};
        Saving.Collection.Staff.find(selector, {sort: {_id: 1}})
            .forEach(function (obj) {
                list.push({
                    label: obj._id + ' | ' + obj.name + ' (' + obj.gender + ')',
                    value: obj._id
                })
            });

        return list;
    },
    client: function () {
        var list = [];
        list.push({label: "(Select One)", value: ""});

        var selector = {cpanel_branchId: Session.get('currentBranch')};
        Saving.Collection.Client.find(selector, {sort: {_id: 1}})
            .forEach(function (obj) {
                list.push({
                    label: obj._id + ' | ' + obj.khName + ' (' + obj.gender + ')',
                    value: obj._id
                })
            });

        return list;
    },
    account: function () {
        var list = [];
        list.push({label: "(Select One)", value: ""});

        var selector = {cpanel_branchId: Session.get('currentBranch')};
        Saving.Collection.Account.find(selector, {sort: {_id: 1}})
            .forEach(function (obj) {
                var getClient = Saving.Collection.Client.findOne(obj.clientId);
                list.push({
                    label: obj._id + ' | ' + getClient.khName + ' (' + getClient.gender + ')',
                    value: obj._id
                })
            });

        return list;
    },
    accountForDeposit: function () {
        var list = [];
        list.push({label: "(Select One)", value: ""});

        var selector = {
            cpanel_branchId: Session.get('currentBranch'),
            $or: [
                {productId: {$not: {$in: [/^1/, /^2/]}}},
                {status: 'Inactive'}
            ]
        };
        Saving.Collection.Account.find(selector, {sort: {_id: 1}})
            .forEach(function (obj) {
                var getClient = Saving.Collection.Client.findOne(obj.clientId);
                list.push({
                    label: obj._id + ' | ' + getClient.khName + ' (' + getClient.gender + ')',
                    value: obj._id
                })
            });

        return list;
    },
    accountForWithdrawal: function () {
        var list = [];
        list.push({label: "(Select One)", value: ""});

        var selector = {
            cpanel_branchId: Session.get('currentBranch')
        };
        Saving.Collection.Account.find(selector, {sort: {_id: 1}})
            .forEach(function (obj) {
                var getLast = lastPerform(obj._id);
                if (!_.isUndefined(getLast)) {
                    // Check status = F
                    if (getLast.status != 'F') {
                        var getClient = Saving.Collection.Client.findOne(obj.clientId);
                        list.push({
                            label: obj._id + ' | ' + getClient.khName + ' (' + getClient.gender + ')',
                            value: obj._id
                        })
                    }
                }
            });

        return list;
    }
};