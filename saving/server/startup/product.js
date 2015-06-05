Meteor.startup(function () {
    if (Saving.Collection.Product.find().count() == 0) {
        Saving.Collection.Product.insert(
            {
                _id: '001',
                name: 'Easy',
                rate: 12
            }
        );
        Saving.Collection.Product.insert(
            {
                _id: '101',
                name: 'Monthly Interest (greater than or equal to one year)',
                rate: 14
            }
        );
        Saving.Collection.Product.insert(
            {
                _id: '102',
                name: 'Monthly Interest (greater than or or equal to two years)',
                rate: 16
            }
        );
        Saving.Collection.Product.insert(
            {
                _id: '201',
                name: 'Final (greater than or equal to one year)',
                rate: 16
            }
        );
        Saving.Collection.Product.insert(
            {
                _id: '202',
                name: 'Final (greater than or equal to two years)',
                rate: 18
            }
        );
        Saving.Collection.Product.insert(
            {
                _id: '301',
                name: 'Staff',
                rate: 18
            }
        );
    }
});