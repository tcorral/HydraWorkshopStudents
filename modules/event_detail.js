/*global window, document, App, CalendarLocale_ES, Calendar*/
(function ( win, doc, ns, core, ajax, und ) {
	'use strict';
	if ( ns === und ) {
		ns = win;
	}
	core.register( 'event_detail', function ( bus ) {
		return {
			oDetail: null,
			init: function () {
				this.oDetail = doc.getElementById( "detail" );
				bus.subscribe( 'schedule', this );
			}
		};
	} );
}( window, document, App, Hydra.module, Hydra.ajax ));