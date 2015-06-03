/**
 * Index
 */
var indexTpl = Template.saving_account;
indexTpl.onCreated(function () {
    // Create new  alertify
    createNewAlertify(['account', 'client', 'staff']);
});

indexTpl.helpers({
    selector: function () {
        var pattern = Session.get('currentBranch');
        //var pattern = new RegExp("^" + branchId.current.branch);
        return {cpanel_branchId: pattern};
    }
});
indexTpl.events({
    'click .insert': function (e, t) {
        alertify.account(fa("plus", "Account"), renderTemplate(Template.saving_accountInsert))
            .maximize();
    },
    'click .update': function (e, t) {
        // check status
        if (this.status == 'Inactive') {
            var data = Saving.Collection.Account.findOne(this._id);
            alertify.account(fa("pencil", "Account"), renderTemplate(Template.saving_accountUpdate, data))
                .maximize();
        } else {
            alertify.warning('You can\'t update active doc');
        }
    },
    'click .remove': function (e, t) {
        // check status
        if (this.status == 'Inactive') {
            var id = this._id;
            alertify.confirm(fa("remove", "Account"), "Are you sure to delete [" + id + "]?", function () {
                    Saving.Collection.Account.remove(id, function (error) {
                        if (error) {
                            alertify.error(error.message);
                        } else {
                            alertify.success("Success");
                        }
                    });
                },
                null
            );
        } else {
            alertify.warning('You can\'t remove active doc');
        }
    },
    'click .show': function (e, t) {
        var data = Saving.Collection.Account.findOne({_id: this._id});
        alertify.alert(fa("eye", "Account"), renderTemplate(Template.saving_accountShow, data));
    }
});

/**
 * Insert
 */
var insertTpl = Template.saving_accountInsert;
insertTpl.onRendered(function () {
    datePicker();
});
insertTpl.events({
    'click .clientInsertAddon': function () {
        alertify.client(fa("plus", "Client"), renderTemplate(Template.saving_clientInsert));
    },
    'click .staffInsertAddon': function () {
        alertify.staff(fa("plus", "Staff"), renderTemplate(Template.saving_staffInsert));
    }
});

/**
 * Update
 */
var updateTpl = Template.saving_accountUpdate;
updateTpl.onRendered(function () {
    datePicker();
});
updateTpl.events({
    'click .clientInsertAddon': function () {
        alertify.client(fa("plus", "Client"), renderTemplate(Template.saving_clientInsert));
    },
    'click .staffInsertAddon': function () {
        alertify.staff(fa("plus", "Staff"), renderTemplate(Template.saving_staffInsert));
    }
});

/**
 * Hook
 */
AutoForm.hooks({
    saving_accountInsert: {
        before: {
            insert: function (doc) {
                var currencyNum = Cpanel.Collection.Currency.findOne(doc.cpanel_currencyId);
                var prefix = doc.clientId + currencyNum.num + doc.productId;
                doc._id = idGenerator.genWithPrefix(Saving.Collection.Account, prefix, 3);

                // cal cycle
                var cycle = 1;
                var lastAccount = Saving.Collection.Account.findOne({clientId: doc.clientId}, {sort: {cycle: -1}});
                if (!_.isUndefined(lastAccount)) {
                    cycle = lastAccount.cycle + 1;
                }

                doc.cycle = cycle;
                doc.status = 'Inactive';
                doc.cpanel_branchId = Session.get('currentBranch');

                return doc;
            }
        },
        onSuccess: function (formType, result) {
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    }
    //saving_accountUpdate: {
    //    before: {
    //        update: function (doc) {
    //            var currentDoc = this.currentDoc;
    //            var updateDoc = this.updateDoc;
    //
    //            console.log(currentDoc);
    //            console.log(updateDoc);
    //
    //            if ((currentDoc.clientId != updateDoc.$set.clientId) || (currentDoc.productId != updateDoc.$set.productId) || (currentDoc.cpanel_currencyId != updateDoc.$set.cpanel_currencyId)) {
    //                console.log('true');
    //                var currencyNum = Cpanel.Collection.Currency.findOne(updateDoc.$set.cpanel_currencyId);
    //                var prefix = updateDoc.$set.clientId + currencyNum.num + updateDoc.$set.productId;
    //                doc.$set._id = idGenerator.genWithPrefix(Saving.Collection.Account, prefix, 3);
    //            }
    //
    //            return doc;
    //        }
    //    },
    //    onSuccess: function (formType, result) {
    //        alertify.account().close();
    //        alertify.success('Success');
    //    },
    //    onError: function (formType, error) {
    //        alertify.error(error.message);
    //    }
    //}
});

/**
 * Config date picker
 */
var datePicker = function () {
    DateTimePicker.date($('[name="accDate"]'));
};
