function schedule(schedule) {

    this.ArrivalTime = schedule.ArrivalTime;
    this.DepartureTime = schedule.DepartureTime;
    this.Id = schedule.Id;
    this.LineNumber = schedule.Transport.LineNumber;
    this.PlatformNumber = schedule.PlatformNumber;
    this.Operator = schedule.Transport.Company.Name;
    //this.Transport = schedule.Transport;
    this.BusStations = schedule.BusStations;
    this.Makat = schedule.Makat;
    this.Chalufa = schedule.Chalufa;
    this.BusStationArrangementD = schedule.BusStationArrangementD;
    this.BusStationArrangementA = schedule.BusStationArrangementA;
    this.OriginTime = schedule.OriginTime;
    this.NextTransitionId = schedule.NextTransitionId;
    this.TransitionId = schedule.TransitionId;
    this.Price = schedule.Price;
    this.MazanToMoza = schedule.MazanToMoza;
    this.TimeToDestination = schedule.TimeToDestination;
    this.WaitingTime = schedule.WaitingTime;
    this.CompanyId = schedule.CompanyId;
    this.CompanyEnglishName = schedule.CompanyEnglishName;
    this.CompanyHebrewName = schedule.CompanyHebrewName;
}

schedule.prototype.getNextTransitionId = function () {
    return this.NextTransitionId;

};