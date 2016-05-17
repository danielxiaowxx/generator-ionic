'use strict';
var yeoman = require('yeoman-generator');
var s = require('underscore.string');
var common = require('../app/common');
var logger = require('../app/logger');
var util = require('../app/util');

var ctrlFolder, ctrlFolderPath, tplFolder, tplFolderPath;

module.exports = yeoman.generators.Base.extend({

  getPrompts: function() {
    var done = this.async();

    var prompts = [{
      name    : 'appName',
      message : 'What is your app name?',
      required: true
    }, {
      name    : 'ctrlName',
      message : 'What is your page name?',
      required: true
    }, {
      name    : 'pageType',
      message : 'What is your page name?',
      list    : ['blank', 'infinite-refresh-thumbnail-list', 'infinite-refresh-avatar-edit-list'],
      default : 'blank',
      required: true
    }];

    this.prompt(prompts, function(props) {

      this.appName = s(props.appName).slugify().value(); // => demo-user
      this.camelAppName = s(this.appName).camelize().value(); // => demoUser
      this.firstCapCamelAppName = s(this.camelAppName).capitalize().value(); // => DemoUser

      this.ctrlName = s(props.ctrlName).slugify().value(); // => demo-user
      this.camelCtrlName = s(this.ctrlName).camelize().value(); // => demoUser
      this.firstCapCamelCtrlName = s(this.camelCtrlName).capitalize().value(); // => DemoUser

      this.pageType = props.pageType;

      ctrlFolder = 'www/js/controllers/';
      ctrlFolderPath = './' + ctrlFolder + '/';
      tplFolder = 'www/js//templates';
      tplFolderPath = './' + tplFolder + '/';

      done();
    }.bind(this));
  },

  copyTemplates: function() {

    this.fs.copyTpl(
      this.templatePath('./' + this.pageType + '/_ctrl.js'),
      this.destinationPath(ctrlFolderPath + this.ctrlName + '-ctrl.js'),
      {
        appName           : this.appName,
        firstCapCamelCtrlName: this.firstCapCamelCtrlName
      });

    this.fs.copyTpl(
      this.templatePath('./' + this.pageType + '/_tpl.html'),
      this.destinationPath(tplFolderPath + this.ctrlName + '.tpl.html'),
      {
        appName           : this.appName,
        firstCapCamelCtrlName: this.firstCapCamelCtrlName
      });
  }

});
