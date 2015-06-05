Template.saving_historyReport.onRendered(function () {
    var name = $('[name="date"]');
    DateTimePicker.date(name);
});

Template.saving_historyReportGen.helpers({
    title: function () {
        return {
            company: function () {
                return Cpanel.Collection.Company.findOne();
            }
        };
    },
    header: function () {
        var self = this;
        var accountDoc = Saving.Collection.Account.findOne(self.account);
        var productDoc = Saving.Collection.Product.findOne(accountDoc.productId);
        var clientDoc = Saving.Collection.Client.findOne(accountDoc.clientId);
        var staffDoc = Saving.Collection.Staff.findOne(accountDoc.staffId);
        var branchDoc = Cpanel.Collection.Branch.findOne(accountDoc.cpanel_branchId);

        return [
            {
                col1: 'Branch: ' + branchDoc.enName,
                col2: 'Cycle: ' + accountDoc.cycle
            },
            {
                col1: 'Currency: ' + accountDoc.cpanel_currencyId,
                col2: 'Client: ' + clientDoc.khName + ' (' + clientDoc.enName + ')'
            },
            {
                col1: 'Product: ' + productDoc.name,
                col2: 'Staff: ' + staffDoc.name
            },
            {
                col1: 'Rate: ' + productDoc.rate + '% per year',
                col2: 'Account date: ' + accountDoc.accDate
            }
        ];
    },
    content: function () {
        var self = this;
        var content = [];
        var index = 1;

        var accountPerform = Saving.Collection.Perform.find({accountId: self.account}, {sort: {_id: 1}});

        accountPerform.forEach(function (obj) {
            content.push(
                {
                    index: index,
                    date: obj.performDate,
                    dayNumber: obj.dayNumber,
                    principalRe: accounting.formatNumber(obj.principalRe, 2),
                    interestRe: accounting.formatNumber(obj.interestRe, 2),
                    amount: accounting.formatNumber(obj.amount, 2),
                    principalBal: accounting.formatNumber(obj.principalBal, 2),
                    interestBal: accounting.formatNumber(obj.interestBal, 2),
                    voucherId: obj.voucherId,
                    memo: obj.memo
                }
            );
            index += 1;
        });

        if (content.length > 0) {
            return content;
        } else {
            return false;
        }
    }
});
