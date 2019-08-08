//=======================================================
// Procedure for Adding onto the game
//	Add attribute [_upgrade]
//  	Edit Reset
//		Edit debug
//		Edit setFromSaveSlot (Load Game)
//		App_SaveState.js -> Edit saveToLocalStorage
//=======================================================




function AppSessionState( ) {
//=======================================================
// [x] Session State - Variables
//=======================================================
	//=======================================================
	// Required Variables about SaveGame
	//=======================================================
	var _storageKey = "tempSlot";		//Use for permentant save
	var _quickKey   = "quickSlot";		//Use for quickSave

	//=======================================================
	// Required Variables about Windows
	//=======================================================
	var _window     = { current : "page1", previous : "" };


	//=======================================================
	// Required Variables about Current Game Run State
	//=======================================================
	var _playerState = {
		//==============================
		// GAME TIMER Variables
		//==============================
		"GameTime" : {					
			"seconds" : {}				
		},

		//==============================
		// STATISTICS Variables
		//   _playerState["Statistics"]["TotalPooCollect"]
		//==============================
		"Statistics" : {
			"TotalPooCollect"    : 0,
			"TotalClicksMade"    : 0,
			"TotalPooSinceStart" : 0,
			"PPS"                : 0
		},

		//==============================
		// STATISTICS Variables
		//   _playerState["Upgrades"]["Shovel"]["upgradeable"]
		//==============================
		"Upgrades" : {					
			"Shovel"       : { "level" : 0, "lock" : true , "upgradeable" : false },
			"Baby"         : { "level" : 0, "lock" : false, "upgradeable" : false },
			"Animal Farm"  : { "level" : 0, "lock" : false, "upgradeable" : false },
			"Toilet"       : { "level" : 0, "lock" : false, "upgradeable" : false }
		}
	}

//=======================================================
// [x] Session State - Methods
//=======================================================
	//=======================================================
	// [x] Window Methods - Complete
	//=======================================================
	function changeStageTo( newWindow ) {
		_window.previous = _window.current;
		_window.current  = newWindow;

		if( _window.previous != "" ) {
			document.getElementById( _window.previous ).style.display = "none";
		}

		document.getElementById( _window.current ).style.display = "block";
	}

	function curWindow( ) { return _window.current; }


	//=======================================================
	// [x] Session State - Timer
	//=======================================================
	function getTimer( ) { return _playerState["GameTime"]["seconds"]; }
	function addTimer( ) { _playerState["GameTime"]["seconds"] = new ED_Timer( ); }



	//=======================================================
	// [x] Session State - Poo Statistics
	//=======================================================
	function addPoo( quantity )      { _playerState["Statistics"]["TotalPooCollect"] += quantity; }
	function subtractPoo( quantity ) { _playerState["Statistics"]["TotalPooCollect"] -= quantity; }
	function getTotalPoo( )          { return _playerState["Statistics"]["TotalPooCollect"]; }

	function addClick( quantity )    { _playerState["Statistics"]["TotalClicksMade"] += quantity; }
	function getTotalClicks( )       { return _playerState["Statistics"]["TotalClicksMade"]; }

	function addPooSinceStart( quantity ) { _playerState["Statistics"]["TotalPooSinceStart"] += quantity; }
	function getPooSinceStart( )          { return _playerState["Statistics"]["TotalPooSinceStart"]; }
	function getPPS( )                    { return _playerState["Statistics"]["PPS"]; }


	//=======================================================
	// [x] Session State - Upgrade Statistics
	//=======================================================
	function upgradeLevelUp( name ) { _playerState["Upgrades"][name]["level"]++; }
	function getLevel( name )       { return _playerState["Upgrades"][name]["level"]; }
	
	function getUpgradeList( ) { return _playerState["Upgrades"]; }
	function calcPPS( )        { _playerState["Statistics"]["PPS"] = UpgradeData.calcAllPPS( _playerState["Upgrades"] ); }

	function isUpgradePurchaseable( name ) {
		let upgradeCost = UpgradeData.calcPrice( name, _playerState["Upgrades"][name]["level"] );

		if( upgradeCost <= _playerState["Statistics"]["TotalPooCollect"] ) {
			_playerState["Upgrades"][name]["upgradeable"] = true;
		} else {
			_playerState["Upgrades"][name]["upgradeable"] = false;
		}

		return _playerState["Upgrades"][name]["upgradeable"];
	}

	function isUpgradeUnLock( name ) { 
		return _playerState["Upgrades"][name]["lock"]; 
	}

	function upgradeToggle( ) {
		for( key in _playerState["Upgrades"] ) {
			isUpgradePurchaseable( key );
		}
	}

	function isUpgradeEligible( ) {
		let retValue    = false;
		let upgradeData = UpgradeData.upgrade;

		//CHECK IF NEXT TIRE UPGRADE IS ELIGIBLE
		for( key in UpgradeData.upgrade ) {
			if( _playerState["Upgrades"][key]["lock"] != true 
				&& _playerState["Statistics"]["TotalPooCollect"] >= ( 0.9 * UpgradeData.upgrade[key]["base"] ) ) {
				_playerState["Upgrades"][key]["lock"] = true;
				retValue = true;
			}
		}

		return retValue;
	}


	//=======================================================
	// [x] Save Keys Methods - Complete
	//=======================================================
	function newSlot( newSlot ) { _storageKey = newSlot; }
	function saveSlot( )        { return _storageKey; }	

	function setFromSaveSlot( slotID, slotData ) {
		_storageKey = slotID;
		_quickKey   = "quickSlot";
		_window     = { current : "page2", previous : "" };

		//==============================================
		// LOADING TIMER
		//==============================================
		let temp = new ED_Timer( );
		temp.createFromJSON( slotData["GameTime"]["seconds"] );
		_playerState["GameTime"]["seconds"] = temp;


		//==============================================
		// LOADING UPGRADES
		//==============================================
		_playerState["Upgrades"] = slotData["Upgrades"];
		upgradeToggle( );
		isUpgradeEligible( );


		//==============================================
		// LOADING STATISTICS
		//==============================================
		_playerState["Statistics"]        = slotData["Statistics"];
		_playerState["Statistics"]["PPS"] = UpgradeData.calcAllPPS( _playerState["Upgrades"] );
	}


	function savePlayerState( ) {
		return {
			"GameTime" : {													
				"seconds" : _playerState["GameTime"]["seconds"].toJSON( )
			},

			"Statistics" : _playerState["Statistics"],
			"Upgrades"   : _playerState["Upgrades"]
		}
	}

	//=======================================================
	// [x] Session State - Loading & Reset
	//=======================================================
	function reset( ) {
		_storageKey 	 	= "tempSlot";
		_quickKey   	 	= "quickSlot";
		_window     	    = { current : "page1", previous : "" };

		_playerState = {
			"GameTime" : {
				"seconds" : {}
			},

			"Statistics" : {
				"TotalPooCollect"    : 0,
				"TotalClicksMade"    : 0,
				"TotalPooSinceStart" : 0,
				"PPS"                : 0
			},

			"Upgrades" : {
				"Shovel"       : { "level" : 0, "lock" : true , "upgradeable" : false },
				"Baby"         : { "level" : 0, "lock" : false, "upgradeable" : false },
				"Animal Farm"  : { "level" : 0, "lock" : false, "upgradeable" : false },
				"Toilet"       : { "level" : 0, "lock" : false, "upgradeable" : false }
			}
		}

		console.clear( );
	}


	//=======================================================
	// [x] Session State - For Debugging Only
	//=======================================================
	function debug( ) {
		console.group( "Session State Condition" );
			console.log( "Storage Key: " + _storageKey );
			console.log( "Quick Key: "   + _quickKey );
			console.log( _window );
			console.log( "Seconds: "                   + _playerState["GameTime"]["seconds"] );
			console.log( "T. Poo Collect: "            + _playerState["Statistics"]["TotalPooCollect"] );
			console.log(                                 _playerState["Upgrades"] );
			console.log( "Total Clicks: "              + _playerState["Statistics"]["TotalClicksMade"] );
			console.log( "Poo Collected since Start: " + _playerState["Statistics"]["TotalPooSinceStart"] );
			console.log( "Poo Per Second: "            + _playerState["Statistics"]["PPS"] );
		console.groupEnd( );
	}


	//=======================================================
	// [x] API Return
	//=======================================================
	let AppSessionStateAPI = {
		//========================
		// GAME - SAVE/LOAD/RESET
		//========================
		reset    : reset,
		makeGame : setFromSaveSlot,
		saveSlot : saveSlot,
		newSlot  : newSlot,

		//========================
		// GAME - WINDOW
		//========================
		getCurWindow   : curWindow,
		changeStageTo  : changeStageTo,

		//========================
		// GAME - TIMER
		//========================
		getTimer    : getTimer,
		addTimer    : addTimer,

		//========================
		// GAME - POO STATISTIC
		//========================
		addPoo           : addPoo,
		getTotalPoo      : getTotalPoo,
		subtractPoo      : subtractPoo,
		addClick         : addClick,
		getTotalClicks   : getTotalClicks,
		addPooSinceStart : addPooSinceStart,
		getPooSinceStart : getPooSinceStart,
		getPPS 			 : getPPS,
		calcPPS          : calcPPS,

		//==========================
		// GAME - UPGRADE STATISTIC
		//==========================
		getUpgradeList	      : getUpgradeList,
		getLevel       	      : getLevel,
		upgradeLevelUp  	  : upgradeLevelUp,
		isUpgradeUnLock       : isUpgradeUnLock,
		isUpgradePurchaseable : isUpgradePurchaseable,
		isUpgradeEligible	  : isUpgradeEligible,
		upgradeToggle         : upgradeToggle,

		//========================
		// GAME - SAVE STATISTIC
		//========================
		savePlayerState : savePlayerState,

		debug : debug
	};

	return AppSessionStateAPI;
};





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