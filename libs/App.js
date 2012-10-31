(function(win, doc, ns, und)
{
	'use strict';
	var App = {};

	if(ns === und)
	{
		ns = win;
	}

	App.url = {};
	App.url.generateDatabaseURL = location.origin + location.pathname.replace( "index.html", "" ) + 'fixtures/database.txt';
	App.data = {};
	App.data.getFilteredDataById = function ( oData, nId ) {
		var aEvents = oData.events.slice( 0 ),
			oEvent = aEvents.shift();
		while ( oEvent ) {
			if ( oEvent.id === nId ) {
				return oEvent;
			}
			oEvent = aEvents.shift();
		}
		return null;
	};
	App.data.getFilteredDataByMonth = function ( oData, nDay, nMonth, nYear ) {
		var aEvents = oData.events.slice(0 ),
			oEvent = aEvents.shift(),
			aFilteredEvents = [];
		while(oEvent)
		{
			if(oEvent.month === nMonth &&  oEvent.year === nYear)
			{
				aFilteredEvents.push(oEvent);
			}
			oEvent = aEvents.shift();
		}
		aFilteredEvents.sort(function(oData1, oData2)
		{
			return oData1.day - oData2.day;
		});
		return aFilteredEvents;
	};
	App.data.getFilteredDataByDay = function ( oData, nDay, nMonth, nYear ) {
		var aMonthEvents = this.getFilteredDataByMonth(oData, nDay, nMonth, nYear ),
			oEvent = aMonthEvents.shift(),
			aFilteredEvents = [];
		while(oEvent)
		{
			if(oEvent.day === nDay)
			{
				aFilteredEvents.push(oEvent);
			}
			oEvent = aMonthEvents.shift();
		}
		return aFilteredEvents;
	};
	ns.App = App;
}(window, document));
