// ==================================================
// registry is closed off from the outside world
// ==================================================
function AppEventRegistry( ) {
	let eventKeys = { };

	function addEventRegistry( id, eType, eCall ) {
		if( !eventKeys.hasOwnProperty( id ) ) {
			eventKeys[ id ] = [ ];
		}

		eventKeys[ id ].push( { eventType : eType, callback : eCall	} );
	}

	function removeEventRegistry( id, eType ) {
		eventKeys[ id ] = eventKeys[ id ].filter( ( element ) => {
			return element.eventType === eType ? false : true;
		});

		if( eventKeys[ id ].length === 0 ) {
			delete eventKeys[ id ];
		}
	}

	function getEventRegistry( id, eType ) {
		let event = "";

		eventKeys[ id ].forEach( ( element ) => {
			if( element.eventType === eType ) {
				event = element;
			}
		});

		return event;
	}

	let registryAPI = {
		add  	 : addEventRegistry,
		remove 	 : removeEventRegistry,
		getEvent : getEventRegistry
	}

	return registryAPI;
}