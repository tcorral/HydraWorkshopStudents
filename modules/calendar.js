/*global window, document, App, CalendarLocale_ES, Calendar*/
(function ( win, doc, ns, core, und ) {
	'use strict';
	if ( ns === und ) {
		ns = win;
	}
	core.register( 'calendar', function ( bus ) {
		return {
			oCalendar: null,
			startCalendar: function () {
				this.oCalendar = new Calendar();
				this.oCalendar
					.setContainer( doc.getElementById( "calendarContainer" ) )
					.setLocale( new CalendarLocale_ES() )
					.setDate( new Date() )
					.insertIntoDOM();
			},
			setBehavior: function () {
				this.oCalendar.onSelectDate = function () {
					bus.publish( 'schedule', 'events:byDay', {
						year: this.nYearSelected,
						month: this.nMonthSelected,
						day: this.nDaySelected
					} );
				};
				this.oCalendar.onChangeMonth = function () {
					bus.publish( 'schedule', 'events:cleanList', {} );
					bus.publish( 'schedule', 'events:byMonth', {
						year: this.nYear,
						month: this.nMonth,
						day: this.nDay
					} );
				};
			},
			init: function () {
				core.start( 'events_list' );
				this.startCalendar();
				this.setBehavior();
				this.oCalendar.onChangeMonth();
			}
		};
	} );
}( window, document, App, Hydra.module ));