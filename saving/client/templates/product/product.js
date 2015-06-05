/**
 * Index
 */
Template.saving_product.onCreated(function () {
    // Create new  alertify
    createNewAlertify('product');
});

Template.saving_product.events({
    'click .update': function (e, t) {
        var data = Saving.Collection.Product.findOne(this._id);
        alertify.product(fa("pencil", "Product"), renderTemplate(Template.saving_productUpdate, data))
            .maximize();
    },
    'click .show': function (e, t) {
        var data = Saving.Collection.Product.findOne({_id: this._id});
        alertify.alert(fa("eye", "Product"), renderTemplate(Template.saving_productShow, data));
    }
});

/**
 * Hook
 */
AutoForm.hooks({
    saving_productUpdate: {
        onSuccess: function (formType, result) {
            alertify.product().close();
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    }
});
