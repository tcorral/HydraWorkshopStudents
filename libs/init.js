/*global window, document, App, CalendarLocale_ES, Calendar, Hydra*/
(function ( win, doc, ns, core, und ) {
	'use strict';
	if ( ns === und ) {
		ns = win;
	}
	core.start('calendar');
	Hydra.setDebug(true);
}( window, document, App, Hydra.module ));