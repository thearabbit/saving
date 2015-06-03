interestCal = function (startDate, endDate, amount, accountId) {
    var start = moment(startDate, 'YYYY-MM-DD');
    var end = moment(endDate, 'YYYY-MM-DD');
    var dayNumber = end.diff(start, 'days');

    // Get account, product info
    var accountDoc = Saving.Collection.Account.findOne(accountId);
    var getProduct = Saving.Collection.Product.findOne(accountDoc.productId);

    var interest = accounting.unformat(accounting.toFixed(amount * dayNumber * ((getProduct.rate / 100) / 365), 2));

    return {
        dayNumber: dayNumber,
        interest: interest,
        rate: getProduct.rate
    };
};

interestCalWithRate = function (startDate, endDate, amount, rate) {
    var start = moment(startDate, 'YYYY-MM-DD');
    var end = moment(endDate, 'YYYY-MM-DD');
    var dayNumber = end.diff(start, 'days');

    var interest = accounting.unformat(accounting.toFixed(amount * dayNumber * ((rate / 100) / 365), 2));

    return {
        dayNumber: dayNumber,
        interest: interest
    };
};