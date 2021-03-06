/*globals module */
module.exports = function(config){
    'use strict';

    config.set({
        basePath: '',
        frameworks: ['mocha', 'referee'],
        files: [
            'lib/**/*.js',
            'test/js/lib/**/*.js',
            'test/js/**/*.js'
        ],

        exclude: [
        ],

        reporters: [
            'progress'
        ],
        port: 9876,
        runnerPort: 9100,
        colors: true,

        logLevel: config.LOG_INFO,

        loggers: [
            {type: 'console'}
        ],
        autoWatch: true,

        browsers: [
            'PhantomJS'
        ],
        captureTimeout: 60000,
        singleRun: false,
        plugins: [
            'karma-*'
        ]
    });
};