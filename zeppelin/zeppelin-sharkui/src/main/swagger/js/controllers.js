'use strict';

/* Controllers */

var sharkcontrollers = angular.module('myApp.controllers', []);



sharkcontrollers.controller('StagesCtrl',function($scope,$http,IdService) {

     $scope.ip = "http://"+window.location.hostname;

    $http({method: 'GET', url: $scope.ip+':8080/json/'}).
    // $http.get('jsons/master1.json').
    success(function(data, status, headers, config) {
    $scope.workers = data.workers;

    }).
    error(function(data, status, headers, config) {

    });

    $http({method: 'GET', url: $scope.ip+':4040/storage/json/'}).
    // $http.get('jsons/storage.json').
    success(function(data, status, headers, config) {
    $scope.storageInfo = data.storageInfo;
    }).
    error(function(data, status, headers, config) {

    });

    $http({method: 'GET', url: $scope.ip+':4040/executors/json/'}).
    // $http.get('jsons/executors.json').
    success(function(data, status, headers, config) {
    $scope.memUsed = data.memUsed;
    $scope.maxMem = data.maxMem;
    $scope.diskUsed = data.diskUsed;
    $scope.execInfo = data.execInfo;
    }).
    error(function(data, status, headers, config) {

    });

    $http({method: 'GET', url: $scope.ip+':4040/stages/json/'}).
    // $http.get('jsons/stages.json').
    success(function(data, status, headers, config) {
    $scope.stage = data;
    $scope.id = IdService.get();
    $scope.activestages = data.activeStages;
    $scope.completedstages = data.completedStages;
    $scope.failedstages = data.failedStages;
    $scope.completedstagesnew = group(data).completedstages;
    $scope.activestagesnew = group(data).activestages;
    $scope.failedstagesnew = group(data).failedstages;
    $scope.stagesnew = [];
    for(var i=0;i<$scope.activestagesnew.length;i++){
        $scope.stagesnew[i] = $scope.activestagesnew[i];
    }
    for(var i=$scope.activestagesnew.length;i<$scope.activestagesnew.length+$scope.completedstagesnew.length;i++){
        $scope.stagesnew[i] = $scope.completedstagesnew[i-$scope.activestagesnew.length];
    }
    for(var i=$scope.activestagesnew.length+$scope.completedstagesnew.length;i<$scope.failedstagesnew.length+$scope.activestagesnew.length+$scope.completedstagesnew.length;i++){
        $scope.stagesnew[i] = $scope.failedstagesnew[i-$scope.activestages.length-$scope.completedstagesnew.length];
    }

    }).
    error(function(data, status, headers, config) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });

     function pushinto(groups,item,id){
        groups[id] = {};

            groups[id].jobid = item.jobid,
            groups[id].description = item.description,
            groups[id].completedTasks = item.completedTasks,
            groups[id].startedTasks = item.startedTasks,
            groups[id].failedTasks = item.failedTasks,
            groups[id].numTasks = item.numTasks,
            groups[id].submissiontime = item.submissiontime,
            groups[id].completiontime = item.completiontime,
            groups[id].shuffleRead = item.shuffleRead,
            groups[id].shuffleWrite = item.shuffleWrite,
            groups[id].numStages = item.numStages;
            groups[id].duration = durations(item);
            groups[id].read = getnum(item.shuffleRead);
            groups[id].write = getnum(item.shuffleWrite);


        return groups;
    }
    function addinto(groups,item,id){

        groups[id].completedTasks = groups[id].completedTasks + item.completedTasks;
        groups[id].startedTasks = groups[id].startedTasks + item.startedTasks;
        groups[id].failedTasks = groups[id].failedTasks + item.failedTasks;
        groups[id].numTasks = groups[id].numTasks + item.numTasks;
        groups[id].shuffleRead = numtostr(getnum(groups[id].shuffleRead) + getnum(item.shuffleRead));
        groups[id].shuffleWrite = numtostr(getnum(groups[id].shuffleWrite) + getnum(item.shuffleWrite));
        if(groups[id].submissiontime>item.submissiontime  ){
            groups[id].submissiontime = item.submissiontime;
        }

        if(groups[id].completiontime<item.completiontime ){
            groups[id].completiontime = item.completiontime;
        }
        groups[id].duration = durations(groups[id]);
        groups[id].read = getnum(groups[id].shuffleRead);
        groups[id].write = getnum(groups[id].shuffleWrite);
        return groups;

    }

    function group(value){
        var groups = {failedstages:[],activestages:[],completedstages:[]};

for(var i=0;i<value.failedStages.length;i++){
    var item = value.failedStages[i];
    var j = 0;
    for(j=0;j<groups.failedstages.length;j++){

        var job = groups.failedstages[j];


     if(job.jobid==item.jobid) {
         groups.failedstages = addinto(groups.failedstages,item,j);
        groups.failedstages[j].failedStages++;

        /*groups.completedstages[item.jobid] = [];*/
        break;
    }
}

 if(j==groups.failedstages.length){


         groups.failedstages = pushinto(groups.failedstages,item,j);

            groups.failedstages[j].completedStages = 0;
             groups.failedstages[j].activeStages = 0;
            groups.failedstages[j].failedStages = 1;
    }


}

for (var i = 0;i< value.activeStages.length ; i++) {
    var item = value.activeStages[i];
    var j =0;
    groups.failedstages = checkandadd(groups.failedstages,item,'a');
    for(j=0;j<groups.activestages.length;j++){

        var job = groups.activestages[j];


     if(job.jobid==item.jobid) {
         groups.activestages = addinto(groups.activestages,item,j);
        groups.activestages[j].activeStages++;

        /*groups.completedstages[item.jobid] = [];*/
        break;
    }
}

 if(j==groups.activestages.length){


         groups.activestages = pushinto(groups.activestages,item,j);

            groups.activestages[j].completedStages = 0;
             groups.activestages[j].activeStages = 1;
            groups.activestages[j].failedStages = 0;

    }

}

for(var i = 0; i < value.completedStages.length; i++) {
    var item = value.completedStages[i];
    var j = 0;

    groups.failedstages = checkandadd(groups.failedstages,item,'c');
    groups.activestages = checkandadd(groups.activestages,item,'c');

    for(j=0;j<groups.completedstages.length;j++){

        var job = groups.completedstages[j];


     if(job.jobid==item.jobid) {
         groups.completedstages = addinto(groups.completedstages,item,j);
        groups.completedstages[j].completedStages++;

        /*groups.completedstages[item.jobid] = [];*/
        break;
    }
}

 if(j==groups.completedstages.length){


         groups.completedstages = pushinto(groups.completedstages,item,j);

            groups.completedstages[j].completedStages = 1;
             groups.completedstages[j].activeStages = 0;
            groups.completedstages[j].failedStages = 0;

    }
}

    return groups ;
}

    function checkandadd(groups,item,key){
         for(var j=0;j<groups.length;j++){

        var job = groups[j];


     if(job.jobid==item.jobid) {
         groups = addinto(groups,item,j);
        if(key=='c'){
            groups[j].completedStages++;
        }
        if(key=='f'){
            groups[j].failedStages++;
        }
        if(key=='a'){
            groups[j].activeStages++;
        }
        /*groups.completedstages[item.jobid] = [];*/
        break;
    }


}
    return groups;
    }


    function numtostr(value){
        if(value<1024){
            return value.toFixed(2).toString() + " B";
        }
        if(value>=1024&&value<1024*1024){
            value = value/1024;
            return value.toFixed(2).toString() + " KB";
        }
        if(value>=1024*1024&&value<1024*1024*1024){
            value = value/1024;
            value = value/1024;
            return value.toFixed(2).toString() + " MB";
        }
        if(value>=1024*1024*1024){
            value = value/1024;
            value = value/1024;
            value = value/1024;
            return value.toFixed(2).toString() + " GB";
        }
    }

    function getnum(value){
        var val,type;
        if (value.length == 0){
            val = 0;
        }
        else{
            val = value.split(" ")[0];
            type = value.split(" ")[1];
        }
        if(type=='KB'){
            val = val*1024;
        }
        if(type=='MB'){
            val = val*1024*1024;
        }
        if(type=='GB'){
            val = val*1024*1024*1024;
        }
        return parseFloat(val);
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

    $scope.gettimediff = function(value1,value2){
        var value1 = new Date(value1);
        var value2 = new Date(value2);
        var difference = value1.getTime() - value2.getTime();
        var secondsDifference = Math.floor(difference/1000);
        var minutesDifference = Math.floor(secondsDifference/60);
        var hoursDifference = Math.floor(minutesDifference/60);
        if(difference<1000){
            var formattedDiff = difference + " ms";
        }
        else if (secondsDifference<60) {
            var formattedDiff = secondsDifference + " Secs";
        }
        else{

            if(minutesDifference<60){
            var formattedDiff = minutesDifference + " Mins";
        }
        else{
            var formattedDiff = hoursDifference + " Hrs";
        }
    }
        return formattedDiff;
    }

    function pushintos(groups,item,id){
        groups[id] = {};

            groups[id].stageid = item.stageid,
            groups[id].jobid = item.jobid,
            groups[id].name = item.name,
            groups[id].description = item.description,
            groups[id].completedTasks = item.completedTasks,
            groups[id].startedTasks = item.startedTasks,
            groups[id].failedTasks = item.failedTasks,
            groups[id].numTasks = item.numTasks,
            groups[id].submissiontime = item.submissiontime,
            groups[id].completiontime = item.completiontime,
            groups[id].shuffleRead = item.shuffleRead,
            groups[id].shuffleWrite = item.shuffleWrite,
            groups[id].duration = durations(item);
            groups[id].read = getnum(item.shuffleRead);
            groups[id].write = getnum(item.shuffleWrite);

         return groups;
    }

    $scope.getonly = function(stages,id){
        var groups = [];
        var count = 0;
        for(var i =0;i<stages.activeStages.length;i++){
            var item = stages.activeStages[i];
            if(item.jobid == id){
               groups = pushintos(groups,item,count);
               count++;
            }
        }
        for(var i =0;i<stages.completedStages.length;i++){
            var item = stages.completedStages[i];
            if(item.jobid == id){
               groups = pushintos(groups,item,count);
               count++;
            }
        }
        for(var i =0;i<stages.failedStages.length;i++){
            var item = stages.failedStages[i];
            if(item.jobid == id){
               groups = pushintos(groups,item,count);
               count++;
            }
        }
    return groups;
    }

    $scope.updateid = function(value){

        IdService.set(value);

    }

    $scope.getval = function(value1,total){
        var value = value1*100;
        value = value/total;
        return value + "%" ;
    }

     $scope.checkworkers = function(stages){
        var groups = [];
        for(var i=0;i<stages.length;i++){
            var item = stages[i];
            if(item.state == 'DEAD'){
               groups[i] = {};
               groups[i].id = item.id;
        }
    }
    return groups;
    }

    $scope.checkshuffleover = function(stages){
        var groups = [];
        var count =0;
        for(var i=0;i<stages.length;i++){
            var item = stages[i];
            if(getnum(item.shuffleWrite)>8*1024){
                groups = pushintos(groups,item,count);
               count++;
        }
    }
     return groups;
}

    $scope.checkshuffleoveronly = function(stages,id){
        var groups = [];
        var count =0;
        for(var i=0;i<stages.length;i++){
            var item = stages[i];
            if(item.jobid == id){
            if(getnum(item.shuffleWrite)>8*1024){
               groups = pushintos(groups,item,count);
               count++;
                }
        }
    }
     return groups;
}

    function duration(stage){
        var value1 = new Date(stage.completiontime);
        var value2 = new Date(stage.submissiontime);
        var difference = value1.getTime() - value2.getTime();
        var secondsDifference = Math.floor(difference/1000);

        return secondsDifference;
    }

    function durations(stage){
        var value1 = new Date(stage.completiontime);
        var value2 = new Date(stage.submissiontime);
        var difference = value1.getTime() - value2.getTime();


        return difference;
    }

    $scope.timeover = function(stages){
        var groups = [];
        var count = 0;
        for(var i=0;i<stages.length;i++){
            var item = stages[i];
            if(duration(item)>20*60){
                groups = pushintos(groups,item,count);
               count++;

        }
    }
     return groups;
    }

    $scope.timeoveronly = function(stages,id){
        var groups = [];
        var count=0;
        for(var i=0;i<stages.length;i++){
            var item = stages[i];
            if(item.jobid == id){
            if(duration(item)>20*60){
                groups = pushintos(groups,item,count);
               count++;
        }
        }
    }
        return groups;
    }

    $scope.checkrdd = function(rdd){
        var groups = [];
        var count = 0;
        for(var i=0;i<rdd.length;i++){
            var item = rdd[i];
            if(item.numCachedPartitions!=item.numPartitions){
                groups[count] = {};
                groups[count].name = item.name,
                groups[count].numPartitions = item.numPartitions,
                groups[count].numCachedPartitions = item.numCachedPartitions
            }
    }
            return groups;
    }

     $scope.checkrddonly = function(rdd,stages,id){
        var groups = {};
        var count = 0;
        for(var i=0;i<rdd.length;i++){
            var item = rdd[i];
        if(stages[id][0].description.indexOf(item.name)>-1){
            if(item.numCachedPartitions!=item.numPartitions){
                groups[count] = {};
                groups[count].name = item.name,
                groups[count].numPartitions = item.numPartitions,
                groups[count].numCachedPartitions = item.numCachedPartitions
        }
    }
}
        return groups;
    }


  });



