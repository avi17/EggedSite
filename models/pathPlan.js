function pathPlan(ID,
                  Transitions,
                  Price,
                  TripTime,
                  Distance
                 ) {

    this.ID = ID;
    this.Transitions = Transitions; ///list
    this.Price = Price;
    this.TripTime = TripTime;
    this.Distance = Distance;

    //inner members
    this.OriginalTransitions = [];
    this.selectedScheduleList = []; 
  


   
}


pathPlan.prototype.showLessSchedules = function (originTime, numOfRowsToShow) {

    angular.copy(this.Transitions, this.OriginalTransitions);

    this.Transitions[0].setLessSchedule(originTime, numOfRowsToShow);

    //if (this.Transitions[0].ScheduleList.length == 0) {
    //    $scope.showFullSchedule();
    //    return;
    //}

    for (var i = 1 ; i < this.Transitions.length; i++) {
        var min = this.Transitions[i - 1].LessScheduleList[0].NextTransitionId;
        var max = this.Transitions[i - 1].LessScheduleList[this.Transitions[i - 1].LessScheduleList.length - 1].NextTransitionId;
        this.Transitions[i].LessScheduleList = this.OriginalTransitions[i].FullScheduleList.slice(min, max + 1);
        this.Transitions[i].ScheduleList = this.Transitions[i].LessScheduleList;
    }

}

pathPlan.prototype.showFullSchedules = function () {
    angular.copy(this.OriginalTransitions, this.Transitions);
}

pathPlan.prototype.setSelectedSchedules = function (schedule) {


    if (this.Transitions.length == 0 || this.Transitions[0].length == 0)
        return;
    //if no schedule chosen it's the defaul init of the first selected schedule in the first transition
    if(!schedule)
        this.Transitions[0].selectedSchedule = this.Transitions[0].ScheduleList[0];
    else
        this.Transitions[0].selectedSchedule = schedule;
    
    //run thfough the rest of transitions
    for (var i = 1; i < this.Transitions.length; i++) {
        var prevTran = this.Transitions[i - 1];
        var curTran = this.Transitions[i];
        if (prevTran.selectedSchedule) //if there is selected schedule for previous transition
            //runthrough schedule list of the current transition
            $.each(curTran.ScheduleList, function (j, schedule) {
                //if you've found schedule with Id that coressponds with Next Transaction of the precious transaction
                if (schedule.Id = prevTran.selectedSchedule.NextTransitionId) {
                    curTran.selectedSchedule = schedule;
                    return false;
                }
            });
    }
   
    //reset the selectedScheduleList to be available in the path plan object 
    //so we can always hold the path to the chosen schedules
    //in the future views - such as details, mobile schedules and etc. 
    for (var i = 0; i < this.Transitions.length; i++) {
        this.selectedScheduleList.push(this.Transitions[i].selectedSchedule);
    }

   

}




