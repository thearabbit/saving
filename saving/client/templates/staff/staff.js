/**
 * Index
 */
Template.saving_staff.onCreated(function () {
    // Create new  alertify
    createNewAlertify('staff');
});

Template.saving_staff.helpers({
    selector: function () {
        var pattern = Session.get('currentBranch');
        //var pattern = new RegExp("^" + branchId.current.branch);
        return {cpanel_branchId: pattern};
    }
});
Template.saving_staff.events({
    'click .insert': function (e, t) {
        alertify.staff(fa("plus", "Staff"), renderTemplate(Template.saving_staffInsert))
            .maximize();
    },
    'click .update': function (e, t) {
        var data = Saving.Collection.Staff.findOne(this._id);
        alertify.staff(fa("pencil", "Staff"), renderTemplate(Template.saving_staffUpdate, data))
            .maximize();
    },
    'click .remove': function (e, t) {
        var id = this._id;

        alertify.confirm(
            fa("remove", "Staff"),
            "Are you sure to delete [" + id + "]?",
            function () {
                Saving.Collection.Staff.remove(id, function (error) {
                    if (error) {
                        alertify.error(error.message);
                    } else {
                        alertify.success("Success");
                    }
                });
            },
            null
        );

    },
    'click .show': function () {
        var data = Saving.Collection.Staff.findOne({_id: this._id});
        alertify.alert(fa("eye", "Staff"), renderTemplate(Template.saving_staffShow, data));
    }
});

/**
 * Insert
 */
Template.saving_staffInsert.onRendered(function () {
    datePicker();
});

/**
 * Update
 */
Template.saving_staffUpdate.onRendered(function () {
    datePicker();
});

/**
 * Hook
 */
AutoForm.hooks({
    saving_staffInsert: {
        before: {
            insert: function (doc) {
                var prefix = Session.get('currentBranch') + '-';
                doc._id = idGenerator.genWithPrefix(Saving.Collection.Staff, prefix, 4);
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
    },
    saving_staffUpdate: {
        onSuccess: function (formType, result) {
            alertify.staff().close();
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
    DateTimePicker.date($('[name="dob"]'));
};
