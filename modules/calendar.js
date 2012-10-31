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
				};
				this.oCalendar.onChangeMonth = function () {
				};
			},
			init: function () {
				this.startCalendar();
				this.setBehavior();
			}
		};
	} );
}( window, document, App, Hydra.module ));