define([
	'jquery',
	'underscore',
	'backbone',
	'models/job',
	'collections/jobs',
	'views/job',
	'text!templates/app.html'
], function($, _, Backbone, JobModel, JobCollection, JobView, AppTemplate){
	
	var AppView = Backbone.View.extend({
		el: $('#container'),

		events: {
			// Add new model to collection on 'Add Job' button click
			"click #add": "addJob"
		},

		initialize: function(){
			_.bindAll(this, 'render', 'appendJob', 'filterOne', 'filter');
			// Bind appendJob callback to collection 'add' event
			this.listenTo(JobCollection, 'add', this.appendJob);
			// Bind filterOne callback to collection models change on active property
			this.listenTo(JobCollection, 'change:active', this.filterOne)
			// Bind filter callback to collection 'filter' event
			// 'filter' event is triggered when clicking on 'active_jobs' and 'inactive_jobs' links
			// See js/routers/router.js
			this.listenTo(JobCollection, 'filter', this.filter);
			// Add persisted models from previous session to collection
			JobCollection.fetch();
			// Render the app view
			this.render();
		},

		// Add new model to collection. Collection triggers 'add' event on create
		addJob: function(){
			// Get values from the 'ADD JOB MENU' "form"
			var jobModel = new JobModel({ 
				title: $('#title').val(),
				description: $('#description').val(),
				contract: $('#contract').val()
			});
			// Add model to collection, then save it. Collection triggers 'add' event
			JobCollection.create(jobModel);
		},

		// Append the new job view to the list
		appendJob: function(jobModel){
			var jobView = new JobView({
				model: jobModel
			});
			// Single job rendering is delegated to the job view
			$('ul', this.el).append(jobView.render().el);
			// Empty the fields of the 'ADD JOB MENU' "form" after adding the job
			$('input', this.el).val("");
		},

		// Trigger 'setVisibility' event. Job view listens to it (see js/views/job.js)
		filterOne: function(jobModel){
			jobModel.trigger('setVisibility');
		},

		// Iterate collection models and pass them to filterOne
		filter: function(){
			// Get the app view reference to use it in operative function
			var self = this;
			_.each(JobCollection.models, function(jobModel){
				self.filterOne(jobModel);
			});
		},

		// Render the app view
		render: function(){
			// Get the app view reference to use it in operative function
			var self = this;
			// Compile and apply template to the app view DOM element
			var template = _.template(AppTemplate, {});
			$(this.el).html(template);
			// In case collection isn't empty, fill the view with persisted job views
			_.each(JobCollection.models, function(jobModel){
				self.appendJob(jobModel);
			});
		}
	});

	return AppView;
});