'use strict';

/* Controllers */

var sharkcontrollers = angular.module('myApp.controllers', []);
  
sharkcontrollers.controller('QueryCtrl', ['$scope', function($scope) {

  }]);
sharkcontrollers.controller('MonitoringCtrl', ['$scope', function($scope) {

  }]);
sharkcontrollers.controller('ModellingCtrl', ['$scope', function($scope) {

  }]);
sharkcontrollers.controller('JobCtrl', ['$scope', function($scope) {

 
  }]);

sharkcontrollers.controller('StagesCtrl',function($scope,$http) {



/*$http({method: 'GET','http://192.150.23.230:4040/stages/json/'}).success(function(data) {
    $scope.stage = data;
    $scope.activestages = data.activeStages;
    $scope.completedstages = data.completedStages;
    $scope.failedstages = data.failedStages;
     });*/
    
    /*$http({method: 'GET', url: 'http://192.150.23.230:4040/stages/json/'}).*/
    $http.get('jsons/stages.json').
    success(function(data, status, headers, config) {
    $scope.stage = data;
    $scope.activestages = data.activeStages;
    $scope.completedstages = data.completedStages;
    $scope.failedstages = data.failedStages;
    $scope.completedstagesnew = group(data.completedStages);
    $scope.activestagesnew = group(data.activeStages);
    $scope.failedstagesnew = group(data.failedStages);
    }).
    error(function(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });

    function group(value){
        var groups = {};

for(var i = 0; i < value.length; i++) {
    var item = value[i];

     if(!groups[item.jobid]) {
        groups[item.jobid] = [];
        groups[item.jobid].push({
            jobid : item.jobid,
            description : item.description,
            completedTasks : item.completedTasks,
            startedTasks : item.startedTasks,
            failedTasks : item.failedTasks,
            numTasks : item.numTasks,
            submissiontime : item.submissiontime,
            completiontime : item.completiontime,
            shuffleRead : item.shuffleRead,
            shuffleWrite : item.shuffleWrite
        })
    }

    else{
        groups[item.jobid][0].completedTasks = groups[item.jobid][0].completedTasks + item.completedTasks;
        groups[item.jobid][0].startedTasks = groups[item.jobid][0].startedTasks + item.startedTasks;
        groups[item.jobid][0].failedTasks = groups[item.jobid][0].failedTasks + item.failedTasks;
        groups[item.jobid][0].numTasks = groups[item.jobid][0].numTasks + item.numTasks;
        groups[item.jobid][0].shuffleRead = groups[item.jobid][0].shuffleRead + item.shuffleRead;
        groups[item.jobid][0].shuffleWrite = groups[item.jobid][0].shuffleWrite + item.shuffleWrite;
        if(groups[item.jobid][0].submissiontime>item.submissiontime  ){
            groups[item.jobid][0].submissiontime = item.submissiontime;
        }
        
        if(groups[item.jobid][0].completiontime<item.completiontime ){
            groups[item.jobid][0].completiontime = item.completiontime;
        }
        
    }

    
}

var result = [];

for(var x in groups) {
    if(groups.hasOwnProperty(x)) {
        
        result.push(groups[x]);
    }
}

return result ;
    }

    function group1(value){
        var i;
        var jobs = 0;
        var jobids = [];
        for(i=0;i<value.length;i++){
            if(value[i].jobid in jobids){
                alert(value[i].jobid);
            }
            else{
                alert(value[i].jobid);
                jobids.push(value[i].jobid);
            }           
            
        }
        return jobids;
    }

    
    $scope.timeconv = function(value){
        var d = new Date(value);
        var formattedDate = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
        var hours = (d.getHours() < 10) ? "0" + d.getHours() : d.getHours();
        var minutes = (d.getMinutes() < 10) ? "0" + d.getMinutes() : d.getMinutes();
        var seconds = (d.getSeconds() < 10) ? "0" + d.getSeconds() : d.getSeconds();
        var formattedTime = hours + ":" + minutes + ":" + seconds;

        formattedDate = formattedDate + " " + formattedTime;
        return formattedDate;
    } 

    $scope.appendit = function(ind,tag){
        return 'stage.'+ String.fromCharCode(ind + 48) +'[0].'+ tag;
    }

    $scope.gettimediff = function(value1,value2){
        var value1 = new Date(value1);
        var value2 = new Date(value2);
        var difference = value1.getTime() - value2.getTime();
        var secondsDifference = Math.floor(difference/1000);
        var formattedDiff = secondsDifference + " Secs";
        return formattedDiff;
    }

    

    function getind(value){
        var i;
        for(i=0;i<jobs.length;i++){
            if(value==jobs[i].jobid){
                break;
            }
        }
        return i;
    }

    $scope.group1 = function(value){
        var i;
        var jobs = 0;
        var jobids = [];
        for(i=0;i<value.length;i++){
        

            
            jobs = jobs + value[i].numTasks;
        }
        return jobs;
    }
    
    
    
  });

  





sharkcontrollers.controller('StorageCtrl', ['$scope', function($scope) {

  }]);
sharkcontrollers.controller('EnvironmentCtrl', ['$scope', function($scope) {

  }]);
sharkcontrollers.controller('ExecutorsCtrl', ['$scope', function($scope) {

  }]);





