/*global window, document, App, CalendarLocale_ES, Calendar*/
(function ( win, doc, ns, core, ajax, und ) {
	'use strict';
	if ( ns === und ) {
		ns = win;
	}
	core.register( 'event_detail', function ( bus ) {
		return {
			oDetail: null,
			oEventsCallbacks: {
				'global:sample': function( oData )
				{
					alert('Calling Global sample');
				},
				'events:loadDetailInfo': function ( oData ) {
					var self = this;
					ajax.call( {
						url: ns.url.generateDatabaseURL,
						dataType: 'json',
						success: function ( oJSON ) {
							self.createDetail( ns.data.getFilteredDataById( oJSON, parseInt( oData.id, 10 ) ) );
						},
						error: function ( oError ) {
						}
					} );
				},
				'events:cleanDetail': function ( oData ) {
					this.oDetail.innerHTML = '';
				}
			},
			createDetail: function ( oData ) {
				var oDetail = doc.createElement( "div" ),
					oHeader = doc.createElement( "h1" ),
					oDescription = doc.createElement( "div" );

				this.oDetail.innerHTML = '';
				oHeader.innerHTML = oData.title;
				oDescription.innerHTML = oData.description;
				oDetail.appendChild( oHeader );
				oDetail.appendChild( oDescription );
				this.oDetail.appendChild( oDetail );
			},
			init: function () {
				this.oDetail = doc.getElementById( "detail" );
				bus.subscribe( 'schedule', this );
			}
		};
	} );
}( window, document, App, Hydra.module, Hydra.ajax ));