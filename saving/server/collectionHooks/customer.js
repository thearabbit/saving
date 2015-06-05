///**
// * Customer
// */
//Saving.Collection.Customer.after.insert(function (userId, doc) {
//    Events.trackInsert({
//        description: doc
//    });
//});
//
//Saving.Collection.Customer.after.update(function (userId, doc, fieldNames, modifier, options) {
//    Events.trackUpdate({
//        description: EJSON.stringify(doc) + ' To ' + EJSON.stringify(modifier)
//    });
//});
//
//Saving.Collection.Customer.after.remove(function (userId, doc) {
//    Events.trackRemove({
//        description: doc
//    });
//});