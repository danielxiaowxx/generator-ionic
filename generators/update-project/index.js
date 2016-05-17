'use strict';
var yeoman = require('yeoman-generator');
var s = require('underscore.string');
var _ = require('lodash');
var fs = require('fs');
var common = require('../app/common');
var logger = require('../app/logger');
var util = require('../app/util');

module.exports = yeoman.generators.Base.extend({

  getPrompts: function() {
    var done = this.async();

    var prompts = [{
      name    : 'appName',
      message : 'What is your app name?',
      default : 'Hello Ionic',
      required: true
    }, {
      name    : 'appId',
      message : 'What is your app id?',
      default : 'com.ionicframework.starter',
      required: true
    }, {
      name    : 'appDesc',
      message : 'what is your app description',
      default : 'An Ionic project',
      required: true
    }, {
      name    : 'authorName',
      message : 'What is your name?',
      required: true
    }, {
      name    : 'authorEmail',
      message : 'What is your email?',
      default : 'you@example.com',
      required: true
    }, {
      name    : 'authorSite',
      message : 'What is your site?',
      default : 'http://example.com.com/',
      required: true
    }];

    this.prompt(prompts, function(props) {

      this.appName = s(props.appName).slugify().value(); // => demo-user
      this.camelAppName = s(this.appName).camelize().value(); // => demoUser
      this.firstCapCamelAppName = s(this.camelAppName).capitalize().value(); // => DemoUser
      this.snakeCaseAppName = _.snakeCase(this.appName); // demo_user

      this.appDesc = props.appDesc;
      this.appId = props.appId;
      this.authorName = props.authorName;
      this.authorEmail = props.authorEmail;
      this.authorSite = props.authorSite;

      done();
    }.bind(this));
  },

  copyTemplates: function() {

    // merge bower.json
    util.mergeJSONFile(this.templatePath('./bower.json'), this.destinationPath('./bower.json'), {
      firstCapCamelAppName: this.firstCapCamelAppName
    });

    // merge package.json
    util.mergeJSONFile(this.templatePath('./package.json'), this.destinationPath('./package.json'), {
      firstCapCamelAppName: this.firstCapCamelAppName,
      appDesc             : this.appDesc
    });

    this.fs.copyTpl(
      this.templatePath('./pre-release-test-app-start.sh'),
      this.destinationPath('./pre-release-test-app-start.sh')
    );
    this.fs.copyTpl(
      this.templatePath('./release-android-app.sh'),
      this.destinationPath('./release-android-app.sh'),
      {
        appName         : this.appName,
        snakeCaseAppName: this.snakeCaseAppName
      }
    );
    this.fs.copyTpl(
      this.templatePath('./release-ios-app.sh'),
      this.destinationPath('./release-ios-app.sh')
    );
    this.fs.copyTpl(
      this.templatePath('./README.md'),
      this.destinationPath('./README.md'),
      {
        appName         : this.appName,
        snakeCaseAppName: this.snakeCaseAppName
      }
    );
    this.fs.copyTpl(
      this.templatePath('./gulpfile.js'),
      this.destinationPath('./gulpfile.js'),
      {
        appName         : this.appName,
        snakeCaseAppName: this.snakeCaseAppName
      }
    );
    this.fs.copyTpl(
      this.templatePath('./config.xml'),
      this.destinationPath('./config.xml'),
      {
        firstCapCamelAppName: this.firstCapCamelAppName,
        appDesc             : this.appDesc,
        appId               : this.appId,
        authorName          : this.authorName,
        authorEmail         : this.authorEmail,
        authorSite          : this.authorSite
      }
    );
  }

});
