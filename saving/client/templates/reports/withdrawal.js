Template.saving_withdrawalReport.onRendered(function () {
    var name = $('[name="date"]');
    DateTimePicker.dateRange(name);
});

Template.saving_withdrawalReportGen.helpers({
    title: function () {
        var self = this;
        return {
            company: function () {
                return Cpanel.Collection.Company.findOne();
            },
            reportName: 'Withdrawal Report',
            date: self.date
        };
    },
    header: function () {
        var self = this;
        var getExchange = Cpanel.Collection.Exchange.findOne(self.exchange);
        return [
            {col1: 'Branch: ' + self.branch, col2: 'Currency: ' + self.currency},
            {col1: 'Product: ' + self.product, col2: 'Exchange: ' + EJSON.stringify(getExchange.rates)}
        ];
    },
    content: function () {
        var self = this;
        var date = s.words(self.date, ' To ');
        //var fDate = moment(date[0], 'YYYY-MM-DD').toDate();
        //var tDate = moment(date[1], 'YYYY-MM-DD').add(1, 'day').toDate();
        var getExchange = Cpanel.Collection.Exchange.findOne(self.exchange);

        // Config fx
        fx.base = getExchange.base;
        fx.rates = getExchange.rates;

        // Get account selector
        var accountSelector = {};
        if (!_.isEmpty(self.branch)) {
            accountSelector.cpanel_branchId = {$regex: self.branch};
        }
        if (!_.isEmpty(self.currency)) {
            accountSelector.cpanel_currencyId = {$regex: self.currency};
        }
        if (!_.isEmpty(self.product)) {
            accountSelector.productId = {$regex: self.product};
        }
        var getAccount = Saving.Collection.Account.find(accountSelector)
            .map(function (obj) {
                return obj._id;
            });

        // Get content
        var getPerform = Saving.Collection.Perform.find({
            amount: {$lt: 0},
            accountId: {$in: getAccount},
            performDate: {$gte: date[0], $lte: date[1]}
        }, {
            sort: {performDate: 1}
        });

        var content = [];
        var index = 1;
        var totalAmount = {KHR: 0, USD: 0, THB: 0, all: 0};
        getPerform.forEach(function (obj) {
            var account = Saving.Collection.Account.findOne(obj.accountId);
            var client = Saving.Collection.Client.findOne(account.clientId);
            var product = Saving.Collection.Product.findOne(account.productId);
            var amount = -obj.amount;

            // Check currency
            if (account.cpanel_currencyId == 'KHR') {
                totalAmount.KHR += amount;
                totalAmount.all += fx.convert(amount, {from: 'KHR', to: 'USD'});
            } else if (account.cpanel_currencyId == 'USD') {
                totalAmount.USD += amount;
                totalAmount.all += amount;
            } else {
                totalAmount.THB += amount;
                totalAmount.all += fx.convert(amount, {from: 'THB', to: 'USD'});
            }

            content.push(
                {
                    index: index,
                    accountId: obj.accountId,
                    client: client.khName + ' (' + client.enName + ')',
                    product: account.productId,
                    activeDate: obj.performDate,
                    amount: accounting.formatNumber(amount, 2),
                    currency: account.cpanel_currencyId,
                    status: obj.status,
                    voucherId: obj.voucherId,
                    branch: obj.cpanel_branchId
                }
            );
            index += 1;
        });

        if (content.length > 0) {
            return {
                data: content,
                footer: [
                    {
                        col1: 'KHR: ' + accounting.formatNumber(totalAmount.KHR, 2),
                        col2: 'USD: ' + accounting.formatNumber(totalAmount.USD, 2),
                        col3: 'THB: ' + accounting.formatNumber(totalAmount.THB, 2),
                        col4: 'Total: ' + accounting.formatNumber(totalAmount.all, 2)
                    }
                ]
            };
        } else {
            return false;
        }
    }
});
