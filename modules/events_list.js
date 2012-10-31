/*global window, document, App, CalendarLocale_ES, Calendar, Hydra*/
(function ( win, doc, ns, core, ajax, und ) {
	'use strict';
	if ( ns === und ) {
		ns = win;
	}

	core.register( 'events_list', function ( bus ) {
		return {
			oList: null,
			setBehavior: function () {
				this.oList.addEventListener( 'click', function ( eEvent ) {

				} );
			},
			init: function () {
				this.oList = doc.getElementById( "events_list" );
				this.setBehavior();
			}
		};
	} );
}( window, document, App, Hydra.module, Hydra.ajax ));