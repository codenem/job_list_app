define([
	'models/job',
	'backbone.localStorage'
], function(JobModel){

	var JobCollection = Backbone.Collection.extend({
		localStorage: new Backbone.LocalStorage('collections/jobs'),

		model: JobModel
	});

	// We need only one collection for the session,
	// so we return a collection instance and not the collection model
	return new JobCollection();
});