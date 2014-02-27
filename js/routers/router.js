define([
	'jquery',
	'underscore',
	'backbone',
	'collections/jobs',
	'filter'
], function($, _, Backbone, JobCollection, Filter){

	var AppRouter = Backbone.Router.extend({
		routes: {
			// Matches #anything between index.html and /
			// Trigger the route, i.e. the setFilter function
			// Used to do things when user clicks on active_jobs and inactive_jobs links
			":filter": "setFilter"
		},

		// Change Filter.value depending on the link clicked
		setFilter: function(filter){
			// If url isn't change (page refresh), Filter.value isn't changed
			// If url is changed, change Filter.value to filter
			Filter.value = filter || Filter.value;
			// Trigger 'filter' event (listened to by the app view)
			JobCollection.trigger('filter');
		}
	});

	return AppRouter;
});