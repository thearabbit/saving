/**
 * Index
 */
Template.saving_deposit.onCreated(function () {
    // Create new  alertify
    createNewAlertify('deposit');
});

Template.saving_deposit.helpers({
    selector: function () {
        var pattern = Session.get('currentBranch');
        //var pattern = new RegExp("^" + branchId.current.branch);
        return {amount: {$gt: 0}, cpanel_branchId: pattern};
    }
});
Template.saving_deposit.events({
    'click .insert': function (e, t) {
        alertify.deposit(fa("plus", "Deposit"), renderTemplate(Template.saving_depositInsert))
            .maximize();
    },
    'click .update': function (e, t) {
        var data = Saving.Collection.Perform.findOne(this._id);

        // Check last record or not
        var getLast = lastPerform(data.accountId);
        if (getLast._id == data._id) {
            alertify.deposit(fa("pencil", "Deposit"), renderTemplate(Template.saving_depositUpdate, data))
                .maximize();
        } else {
            // Check dep or with
            var type = 'deposit';
            if (getLast.amount < 0) {
                type = 'withdrawal';
            }
            var info = '(Voucher ID: ' + getLast.voucherId + ' in ' + type + ')';

            alertify.warning('You can\'t update this, because don\'t last doc ' + info);
        }
    },
    'click .remove': function (e, t) {
        var self = this;

        // Check last record or not
        var getLast = lastPerform(self.accountId);
        if (getLast._id == self._id) {
            alertify.confirm(
                fa("remove", "Deposit"),
                "Are you sure to delete [" + self._id + "]?",
                function () {
                    Saving.Collection.Perform.remove(self._id, function (error) {
                        if (error) {
                            alertify.error(error.message);
                        } else {
                            alertify.success("Success");
                        }
                    });
                },
                null
            );
            // If status = N, update status on account collection to "Inactive"
            if (self.status == 'N') {
                Saving.Collection.Account.update(self.accountId, {$set: {status: 'Inactive'}});
            }

        } else {
            // Check dep or with
            var type = 'deposit';
            if (getLast.amount < 0) {
                type = 'withdrawal';
            }
            var info = '(Voucher ID: ' + getLast.voucherId + ' in ' + type + ')';

            alertify.warning('You can\'t remove this, because don\'t last doc ' + info);
        }
    },
    'click .show': function (e, t) {
        var data = Saving.Collection.Perform.findOne({_id: this._id});
        alertify.alert(fa("eye", "Deposit"), renderTemplate(Template.saving_depositShow, data));
    }
});

/**
 * Insert
 */
Template.saving_depositInsert.onRendered(function () {
    datePicker();
});
Template.saving_depositInsert.helpers({
    accountId: function () {
        return Saving.List.accountForDeposit();
    }
});

/**
 * Update
 */
Template.saving_depositUpdate.onRendered(function () {
    //datePicker();
});

/**
 * Hook
 */
AutoForm.hooks({
    saving_depositInsert: {
        before: {
            insert: function (doc) {
                var prefix = doc.accountId;
                doc._id = idGenerator.genWithPrefix(Saving.Collection.Perform, prefix, 4);

                // Get last perform
                var getLast = lastPerform(doc.accountId);
                if (!_.isUndefined(getLast)) { // for the 2, 3... time
                    var newCal = interestCal(getLast.performDate, doc.performDate, getLast.principalBal, doc.accountId);
                    doc.dayNumber = newCal.dayNumber;
                    doc.principalRe = getLast.principalBal;
                    doc.interestRe = getLast.interestBal + newCal.interest;
                    doc.principalBal = getLast.principalBal + doc.amount;
                    doc.interestBal = doc.interestRe;
                    doc.status = 'A';
                } else { // for the 1st time
                    // check with account date
                    var accountDoc = Saving.Collection.Account.findOne(doc.accountId);
                    if (accountDoc.accDate != doc.performDate) {
                        alertify.warning('Deposit date must be equal to account date (' + accountDoc.accDate + ') for the first time.');
                        return false;
                    }
                    doc.dayNumber = 0;
                    doc.principalRe = 0;
                    doc.interestRe = 0;
                    doc.principalBal = doc.amount;
                    doc.interestBal = 0;
                    doc.status = 'N';
                }

                doc.cpanel_branchId = Session.get('currentBranch');

                return doc;
            }
        },
        onSuccess: function (formType, result) {
            // update status to "Active" on account collection
            var doc = this.insertDoc;
            Saving.Collection.Account.update(doc.accountId, {$set: {status: 'Active'}});

            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    },
    saving_depositUpdate: {
        before: {
            update: function (doc) {
                var updateDoc = this.updateDoc;

                // Get last perform
                var getLast = lastPerformExcept(updateDoc.$set.accountId, this.docId);
                if (!_.isUndefined(getLast)) { // for the 2, 3... time
                    var newCal = interestCal(getLast.performDate, updateDoc.$set.performDate, getLast.principalBal, updateDoc.$set.accountId);

                    doc.$set.dayNumber = newCal.dayNumber;
                    doc.$set.principalRe = getLast.principalBal;
                    doc.$set.interestRe = getLast.interestBal + newCal.interest;
                    doc.$set.principalBal = getLast.principalBal + updateDoc.$set.amount;
                    doc.$set.interestBal = updateDoc.$set.interestRe;
                    doc.$set.status = 'A';
                } else {
                    // check with account date
                    var accountDoc = Saving.Collection.Account.findOne(doc.accountId);
                    if (accountDoc.accDate != doc.performDate) {
                        alertify.warning('Deposit date must be equal to account date (' + accountDoc.accDate + ') for the first time.');
                        return false;
                    }

                    doc.$set.dayNumber = 0;
                    doc.$set.principalRe = 0;
                    doc.$set.interestRe = 0;
                    doc.$set.principalBal = updateDoc.$set.amount;
                    doc.$set.interestBal = 0;
                    doc.$set.status = 'N';
                }

                return doc;
            }
        },
        onSuccess: function (formType, result) {
            alertify.deposit().close();
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    }
});

/**
 * Config date picker
 */
var datePicker = function () {
    DateTimePicker.date($('[name="performDate"]'));
};
