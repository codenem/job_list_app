define([
    'jquery',
    'underscore',
    'backbone',
    'collections/jobs',
    'text!templates/job.html',
    'filter'
], function ($, _, Backbone, JobCollection, jobTemplate, Filter) {

    var JobView = Backbone.View.extend({
        tagName: 'li',

        events: {
            // Click on the job title to show details
            "click span": "displayDetails",
            // Start typing in a detail field to show the 'Save' button
            "keypress .detail_field": "displaySave",
            // Save changes on 'Save' button click
            "click #save": "changeDetails",
            // Toggle active value between false and true on checkbox click
            "click input[type=checkbox]": "changeActive",
            // Click on the 'X' button to delete job
            "click #delete": "clear"
        },

        initialize: function () {
            _.bindAll(this, 'render', 'setVisibility', 'alertError', 'clear', 'unrender');
            // Binds render to 'change' event
            // Occurs when changeDetails is called (on model setting)
            this.listenTo(this.model, 'change', this.render);
            // Binds alertError to 'invalid' event ('invalid' is thrown by the validate method in job model)
            this.listenTo(this.model, 'invalid', this.alertError);
            // Bind setVisibility to 'setVisiblity' event
            this.listenTo(this.model, 'setVisibility', this.setVisibility);
            // Binds unrender to 'destroy' event
            this.listenTo(this.model, 'destroy', this.unrender);
        },

        // Show details
        displayDetails: function () {
            // Empty previous detail field entries if not saved
            $('.detail_field').val('');
            // Toggle between hide or show details
            $('#details', this.el).is(":visible") ?
                $('#details', this.el).hide() :
                $('#details', this.el).show();
            // Hide the 'Save' button as nothing has been typed in the fields for now
            $('#save', this.el).hide();
        },

        // Show 'Save' button
        displaySave: function () {
            $('button', this.el).show();
        },

        // Save changes
        changeDetails: function () {
            var jobDetails = {
                title: $('#new_title', this.el).val().trim() != '' ?
                        $('#new_title', this.el).val() : this.model.get('title'),

                description: $('#new_description', this.el).val() != '' ?
                        $('#new_description', this.el).val() : this.model.get('description'),

                contract: $('#new_contract', this.el).val() != '' ?
                        $('#new_contract', this.el).val() : this.model.get('contract')
            };
            this.model.set(jobDetails);
            this.model.save();
        },

        // Toggle active value between false and true
        changeActive: function () {
            this.model.get('active') ?
                this.model.set({ active: false }) : this.model.set({ active: true });
            this.model.save();
        },

        // Set the visibility of the job view.
        // Uses the Filter.value property (see js/filter.js)
        setVisibility: function () {
            // Show active jobs when the active_jobs link is clicked,
            // or on page load
            if (Filter.value == 'active' && this.model.get('active')){
                $(this.el).show();
            }
            // Show inactive jobs when the inactive_jobs link is clicked
            else if (Filter.value == 'inactive' && !this.model.get('active')){
                $(this.el).show();
            }
            // Hide other entries
            else {
                $(this.el).hide();
            }
        },

        // Unrender non validated job and alert validation error
        alertError: function () {
            this.unrender();
            alert(this.model.validationError);
        },

        // Delete job
        clear: function () {
            this.model.destroy();
        },

        // Render the job view
        render: function () {
            // Compile and apply template to the job view DOM element
            var template = _.template( jobTemplate, this.model.toJSON() );
            $(this.el).html(template);
            // Hide job details by default
            $('#details', this.el).hide();
            // Trigger 'setVisibility' event to filter inactive jobs
            this.model.trigger('setVisibility');
            // Allow chaining
            return this;
        },

        // Unrender the job view
        unrender: function () {
            $(this.el).remove();
        }
    });

    return JobView;
});
