/**
 * Index
 */
Template.saving_withdrawal.onCreated(function () {
    // Create new  alertify
    createNewAlertify('withdrawal');
});

Template.saving_withdrawal.helpers({
    selector: function () {
        var pattern = Session.get('currentBranch');
        //var pattern = new RegExp("^" + branchId.current.branch);
        return {amount: {$lt: 0}, cpanel_branchId: pattern};
    }
});
Template.saving_withdrawal.events({
    'click .insert': function (e, t) {
        alertify.withdrawal(fa("plus", "Withdrawal"), renderTemplate(Template.saving_withdrawalInsert))
            .maximize();
    },
    'click .remove': function (e, t) {
        var id = this._id;

        // Check last record or not
        var getLast = lastPerform(this.accountId);
        if (getLast._id == id) {
            alertify.confirm(
                fa("remove", "Withdrawal"),
                "Are you sure to delete [" + id + "]?",
                function () {
                    Saving.Collection.Perform.remove(id, function (error) {
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
        alertify.alert(fa("eye", "Withdrawal"), renderTemplate(Template.saving_withdrawalShow, data));
    }
});

/**
 * Insert
 */
Template.saving_withdrawalInsert.onRendered(function () {
    datePicker();
});
Template.saving_withdrawalInsert.helpers({
    accountId: function () {
        return Saving.List.accountForWithdrawal();
    }
});
Template.saving_withdrawalInsert.events({
    'focus [name="performDate"]': function (e, t) {
        t.$('[type="submit"]').attr('disabled', 'disabled');
    },
    'change [name="accountId"]': function (e, t) {
        t.$('[type="submit"]').attr('disabled', 'disabled');
    },
    'click .confirm': function (e, t) {
        confirm(e, t, 'insert');
    }
});
Template.saving_withdrawalInsert.onDestroyed(function () {
    //
});

/**
 * Hook
 */
AutoForm.hooks({
    saving_withdrawalInsert: {
        before: {
            insert: function (doc) {
                var totalRe = doc.principalRe + doc.interestRe;

                var prefix = doc.accountId;
                doc._id = idGenerator.genWithPrefix(Saving.Collection.Perform, prefix, 4);

                // Check amount
                if (doc.amount > totalRe) {
                    alertify.warning('Withdrawal amount is greater than amount receivable');
                    return false;
                } else {
                    // calculate principal and interest balance
                    doc.status = 'P';
                    if (doc.amount > doc.interestRe) {
                        doc.principalBal = doc.principalRe - (doc.amount - doc.interestRe);
                        doc.interestBal = 0;
                        if (doc.principalBal == 0) {
                            doc.status = 'F';
                        }
                    } else {
                        doc.principalBal = doc.principalRe;
                        doc.interestBal = doc.amount - doc.interestRe;
                    }
                    doc.amount = -doc.amount;
                    doc.cpanel_branchId = Session.get('currentBranch');

                    return doc;
                }
            }
        },
        onSuccess: function (formType, result) {
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    }
});

//----------------------------------------------------------------

// Config date picker
var datePicker = function () {
    DateTimePicker.date($('[name="performDate"]'));
};

// Confirm
var confirm = function (e, t) {
    var performDate = t.$('[name="performDate"]').val();
    var accountId = t.$('[name="accountId"]').val();

    if (_.isEmpty(performDate) || _.isEmpty(accountId)) {
        alertify.error('Active date and account id is required');
    } else {
        // Get detail info
        var accountDoc = Saving.Collection.Account.findOne(accountId);
        var clientDoc = Saving.Collection.Client.findOne(accountDoc.clientId);
        var currencyDoc = Cpanel.Collection.Currency.findOne(accountDoc.cpanel_currencyId);
        var productDoc = Saving.Collection.Product.findOne(accountDoc.productId);

        // For last performance record
        var getLast = lastPerform(accountId, performDate);
        var getLastNoPerformDate = lastPerform(accountId);
        if (_.isUndefined(getLast)) {
            alertify.warning('Confirm', 'This account don\'t have deposit yet.');
        } else {
            // Receivable interest
            var interestCalResult = interestCalWithRate(getLast.performDate, performDate, getLast.principalBal, productDoc.rate);
            var dayNumberResult = interestCalResult.dayNumber;
            t.$('[name="dayNumber"]').val(dayNumberResult);

            var principalResult = getLast.principalBal;
            var interestResult = getLast.interestBal + interestCalResult.interest;
            var totalResult = principalResult + interestResult;
            var actualRate = productDoc.rate;

            var confirmData;

            // Check product
            if (s.startsWith(productDoc._id, '1') || s.startsWith(productDoc._id, '2')) { // Monthly interest or maturity date
                // cal maturity date
                var yearNumber = 1;
                var maturityDate = {};
                maturityDate.label = 'primary';

                if (productDoc._id == '102' || productDoc._id == '202') {
                    yearNumber = 2;
                }
                maturityDate.value = moment(getLast.performDate, 'YYYY-MM-DD').add(yearNumber, 'years').toDate();
                maturityDate.value = moment(maturityDate.value).format('YYYY-MM-DD');

                // Check product to confirm
                var easyProductId = '001';
                var getEasyProduct = Saving.Collection.Product.findOne(easyProductId);

                if (s.startsWith(productDoc._id, '1')) {
                    var penalty = 0;
                    if (performDate < maturityDate.value) {
                        maturityDate.label = 'warning';

                        // Cal penalty interest with easy rate
                        var sumOfInterest = 0;
                        Saving.Collection.Perform.find(accountId)
                            .forEach(function (obj) {
                                sumOfInterest += obj.interestRe;
                            });
                        var varianceOfRate = productDoc.rate - getEasyProduct.rate;
                        penalty = (interestResult + sumOfInterest) * varianceOfRate / productDoc.rate;
                    }

                    confirmData = {
                        dayNumber: dayNumberResult,
                        principal: accounting.format(principalResult, 2),
                        interest: accounting.format(interestResult, 2) + ' (Rate: ' + accounting.format(actualRate, 2) + ')',
                        total: accounting.format(totalResult, 2),
                        penalty: accounting.format(penalty, 2),
                        client: clientDoc.khName,
                        accDate: accountDoc.accDate,
                        currency: currencyDoc._id,
                        product: productDoc._id + ' | ' + productDoc.name,
                        rate: accounting.format(productDoc.rate, 2),
                        maturityDate: maturityDate,
                        lastActiveDate: getLastNoPerformDate.performDate
                    };

                    alertify.alert('Confirm', renderTemplate(Template.saving_withdrawalConfirmProduct1, confirmData), function () {
                        t.find('[name="principalRe"]').value = principalResult;
                        t.find('[name="interestRe"]').value = interestResult;

                        var withdrawalOpt = $('[name="withdrawalConfirmRadio"]:checked').val();

                        if (withdrawalOpt == 'interest') {
                            t.find('[name="amount"]').value = interestResult;
                            t.find('[name="memo"]').value = '';
                        } else {
                            t.find('[name="amount"]').value = totalResult;
                            t.find('[name="memo"]').value = 'Penalty: ' + accounting.format(penalty, 2);
                        }

                        t.$('[type="submit"]').removeAttr('disabled');
                        t.$('[name="amount"]').attr('readonly', 'readonly');
                    });
                } else { // product id = 2...
                    if (performDate < maturityDate.value) {
                        maturityDate.label = 'warning';

                        // change result
                        interestCalResult = interestCalWithRate(getLast.performDate, performDate, getLast.principalBal, getEasyProduct.rate);
                        interestResult = getLast.interestBal + interestCalResult.interest;
                        totalResult = principalResult + interestResult;
                        actualRate = getEasyProduct.rate;
                    }

                    confirmData = {
                        dayNumber: dayNumberResult,
                        principal: accounting.format(principalResult, 2),
                        interest: accounting.format(interestResult, 2) + ' (Rate: ' + accounting.format(actualRate, 2) + ')',
                        total: accounting.format(totalResult, 2),
                        client: clientDoc.khName,
                        accDate: accountDoc.accDate,
                        currency: currencyDoc._id,
                        product: productDoc._id + ' | ' + productDoc.name,
                        rate: accounting.format(productDoc.rate, 2),
                        maturityDate: maturityDate,
                        lastActiveDate: getLastNoPerformDate.performDate
                    };

                    alertify.alert('Confirm', renderTemplate(Template.saving_withdrawalConfirmProduct2, confirmData), function () {
                        t.find('[name="principalRe"]').value = principalResult;
                        t.find('[name="interestRe"]').value = interestResult;
                        t.find('[name="amount"]').value = totalResult;

                        t.$('[type="submit"]').removeAttr('disabled');
                        t.$('[name="amount"]').attr('readonly', 'readonly');
                    });
                }
            } else { // general
                confirmData = {
                    dayNumber: dayNumberResult,
                    principal: accounting.format(principalResult, 2),
                    interest: accounting.format(interestResult, 2),
                    total: accounting.format(totalResult, 2),
                    client: clientDoc.khName,
                    accDate: accountDoc.accDate,
                    currency: currencyDoc._id,
                    product: productDoc._id + ' | ' + productDoc.name,
                    rate: accounting.format(productDoc.rate, 2),
                    lastActiveDate: getLastNoPerformDate.performDate
                };

                alertify.alert('Confirm', renderTemplate(Template.saving_withdrawalConfirm, confirmData), function () {
                    t.find('[name="principalRe"]').value = principalResult;
                    t.find('[name="interestRe"]').value = interestResult;
                    t.find('[name="amount"]').value = totalResult;

                    t.$('[type="submit"]').removeAttr('disabled');
                    t.$('[name="amount"]').removeAttr('readonly');
                });
            }
        }
    }
};