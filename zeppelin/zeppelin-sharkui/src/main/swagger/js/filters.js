'use strict';

/* Filters */

angular.module('myApp.filters', []).
  filter("reverse", function(){
    return function(items){
        return items.slice().reverse(); // Create a copy of the array and reverse the order of the items
    };
});


