/*global window, document, App, CalendarLocale_ES, Calendar, Hydra*/
(function ( win, doc, ns, core, ajax, und ) {
	'use strict';
	if ( ns === und ) {
		ns = win;
	}

	core.register( 'events_list', function ( bus ) {
		return {
			oList: null,
			oEventsCallbacks: {
				'events:cleanList': function () {
					this.oList.innerHTML = '';
				},
				'events:byDay': function ( oData ) {
					var self = this;
					ajax.call( {
						url: ns.url.generateDatabaseURL,
						dataType: 'json',
						success: function ( oJSON ) {
							self.fillList( ns.data.getFilteredDataByDay(oJSON, oData.day, oData.month, oData.year) );
							bus.publish( 'schedule', 'events:cleanDetail', {} );
						},
						error: function ( oError ) {
						}
					} );
				},
				'events:byMonth': function ( oData ) {
					var self = this;
					ajax.call( {
						url: ns.url.generateDatabaseURL,
						dataType: 'json',
						success: function ( oJSON ) {
							self.fillList( ns.data.getFilteredDataByMonth(oJSON, oData.day, oData.month, oData.year) );
							bus.publish( 'schedule', 'events:cleanDetail', {} );
						},
						error: function ( oError ) {
						}
					} );
				}
			},
			fillList: function ( aData ) {
				this.oList.innerHTML = '';
				var aArray = aData.slice( 0 ),
					oItem = aArray.shift(),
					oLI;

				while ( oItem ) {
					oLI = doc.createElement( 'li' );
					oLI.id = oItem.id;
					oLI.innerHTML = '<div><span>Title: ' + oItem.title + '</span><br/><span>Day: ' + oItem.day + '</span></div>';
					this.oList.appendChild( oLI );
					oItem = aArray.shift();
				}
				aArray = oItem = oLI = null;
			},
			setBehavior: function () {
				this.oList.addEventListener( 'click', function ( eEvent ) {
					var oTarget = eEvent.target;
					while ( oTarget !== document && oTarget.tagName.toLowerCase() !== 'li' ) {
						oTarget = oTarget.parentNode;
					}
					if ( oTarget === document ) {
						return false;
					}
					bus.publish( 'schedule', 'events:loadDetailInfo', {
						id: oTarget.id
					} );
					return true;
				} );
			},
			init: function () {
				core.start( 'event_detail' );
				this.oList = doc.getElementById( "events_list" );
				bus.subscribe( 'schedule', this );
				this.setBehavior();
			}
		};
	} );
}( window, document, App, Hydra.module, Hydra.ajax ));