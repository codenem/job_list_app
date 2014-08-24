define([
    'backbone'
], function (Backbone) {

    var JobModel = Backbone.Model.extend({
        // When creating a job entry, default for active is true
        defaults: {
            active: true,
            title: '',
            description: '',
            contract: ''
        },

        // Title is mandatory
        validate: function (attributes) {
            if (attributes.title === '') {
                return "Title is mandatory!";
            }
        }
    });

    return JobModel;
});
