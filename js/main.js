require.config({
    shim: {
        jquery: {
            exports: '$'
        },
        underscore: {
            exports: '_'
        },

        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        }
    },

    paths : {
        jquery: 'libs/jquery/dist/jquery',
        underscore: 'libs/underscore/underscore',
        backbone: 'libs/backbone/backbone',
        'backbone.localStorage': 'libs/backbone.localStorage/backbone.localStorage',
        text: 'libs/requirejs-text/text'
    }
});

require([
    'jquery',
    'underscore',
    'backbone',
    'views/app',
    'routers/router',
    'backbone.localStorage'
], function ($, _, Backbone, AppView, AppRouter) {
    // Initialize controller
    new AppRouter();
    // Begin monitoring hashchange events and dispatch routes
    Backbone.history.start();
    // Initialize app
    new AppView();
});
