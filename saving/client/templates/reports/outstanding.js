Template.saving_outstandingReport.onRendered(function () {
    var name = $('[name="date"]');
    DateTimePicker.date(name);
});

Template.saving_outstandingReportGen.helpers({
    title: function () {
        var self = this;
        return {
            company: function () {
                return Cpanel.Collection.Company.findOne();
            },
            reportName: 'Outstanding Report',
            date: self.date
        };
    },
    header: function () {
        var self = this;
        var getExchange = Cpanel.Collection.Exchange.findOne(self.exchange);
        var exchangeStr = getExchange.rates;
        return [
            {col1: 'Branch: ' + self.branch, col2: 'Currency: ' + self.currency},
            {col1: 'Product: ' + self.product, col2: 'Exchange: ' + EJSON.stringify(exchangeStr)}
        ];
    },
    content: function () {
        var self = this;
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
        accountSelector.accDate = {$lte: self.date};

        var getAccount = Saving.Collection.Account.find(accountSelector, {sort: {_id: 1}});

        console.log(getAccount.count());

        var content = [];
        var index = 1;
        var totalPrincipal = {KHR: 0, USD: 0, THB: 0, all: 0};
        var totalInterest = {KHR: 0, USD: 0, THB: 0, all: 0};
        var totalAll = {KHR: 0, USD: 0, THB: 0, all: 0};

        getAccount.forEach(function (obj) {
            // Get last performance
            var getLast = lastPerform(obj._id, self.date);

            console.log(getLast);

            if (!(_.isUndefined(getLast) || getLast.status == 'F')) {
                var client = Saving.Collection.Client.findOne(obj.clientId);
                var product = Saving.Collection.Product.findOne(obj.productId);

                var principal = getLast.principalBal;
                var cal = interestCal(getLast.performDate, self.date, principal, obj._id);
                var interest = getLast.interestBal + cal.interest;
                var total = principal + interest;

                // Check currency
                if (obj.cpanel_currencyId == 'KHR') {
                    totalPrincipal.KHR += principal;
                    totalInterest.KHR += interest;
                    totalAll.KHR += total;

                    totalPrincipal.all += fx.convert(principal, {from: 'KHR', to: 'USD'});
                    totalInterest.all += fx.convert(interest, {from: 'KHR', to: 'USD'});
                    totalAll.all += fx.convert(total, {from: 'KHR', to: 'USD'});
                } else if (obj.cpanel_currencyId == 'USD') {
                    totalPrincipal.USD += principal;
                    totalInterest.USD += interest;
                    totalAll.USD += total;

                    totalPrincipal.all += principal;
                    totalInterest.all += interest;
                    totalAll.all += total;
                } else {
                    totalPrincipal.THB += principal;
                    totalInterest.THB += interest;
                    totalAll.THB += total;

                    totalPrincipal.all += fx.convert(principal, {from: 'THB', to: 'USD'});
                    totalPrincipal.all += fx.convert(interest, {from: 'THB', to: 'USD'});
                    totalAll.all += fx.convert(total, {from: 'THB', to: 'USD'});
                }

                content.push(
                    {
                        index: index,
                        accountId: obj._id,
                        client: client.khName + ' (' + client.enName + ')',
                        product: obj.productId,
                        activeDate: obj.accDate,
                        principal: accounting.formatNumber(principal, 2),
                        interest: accounting.formatNumber(interest, 2),
                        total: accounting.formatNumber(total, 2),
                        currency: obj.cpanel_currencyId,
                        branch: obj.cpanel_branchId
                    }
                );
                index += 1;
            }
        });

        if (content.length > 0) {
            return {
                data: content,
                footer: [
                    {
                        col1: 'KHR',
                        col2: accounting.formatNumber(totalPrincipal.KHR, 2),
                        col3: accounting.formatNumber(totalInterest.KHR, 2),
                        col4: accounting.formatNumber(totalAll.KHR, 2)
                    },
                    {
                        col1: 'USD',
                        col2: accounting.formatNumber(totalPrincipal.USD, 2),
                        col3: accounting.formatNumber(totalInterest.USD, 2),
                        col4: accounting.formatNumber(totalAll.USD, 2)
                    },
                    {
                        col1: 'THB',
                        col2: accounting.formatNumber(totalPrincipal.THB, 2),
                        col3: accounting.formatNumber(totalInterest.THB, 2),
                        col4: accounting.formatNumber(totalAll.THB, 2)
                    },
                    {
                        col1: 'Convert to USD',
                        col2: accounting.formatNumber(totalPrincipal.all, 2),
                        col3: accounting.formatNumber(totalInterest.all, 2),
                        col4: accounting.formatNumber(totalAll.all, 2)
                    }
                ]
            };
        } else {
            return false;
        }
    }
});
