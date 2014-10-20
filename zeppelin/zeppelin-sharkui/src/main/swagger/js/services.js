'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var app = angular.module('myApp.services', []).
  value('version', '0.1');

  app.service('IdService', function() {
  	var val;

    this.set = function(id) { val = id; };
     
    this.get = function() { return val; };
     
    
});


