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
	// TIMERS variables
	//=====================
	var _runTime 		 = {};			


	//=======================================================
	// STATISTICS variables
	//========================
	var _totalPooCollect    = 0;
	var _totalClicksMade    = 0;
	var _totalPooSinceStart = 0;
	var _PPS                = 0;


	//=======================================================
	// UPGRADES variables
	//=====================
	var _upgradeList     = {
		"Shovel"       : { "level" : 0, "lock" : true , "upgradeable" : false },
		"Baby"         : { "level" : 0, "lock" : false, "upgradeable" : false },
		"Moo Moo Farm" : { "level" : 0, "lock" : false, "upgradeable" : false },
		"Bathroom"     : { "level" : 0, "lock" : false, "upgradeable" : false }
	};


	var _playerState = {
		"GameTime" : {					// _playerState["GameTime"]["seconds"]
			"seconds" : {}				// Keeps track of how long the game has run
		},

		"Statistics" : {				// _playerState["Statistics"]["TotalPooCollect"]
			"TotalPooCollect"    : 0,
			"TotalClicksMade"    : 0,
			"TotalPooSinceStart" : 0,
			"PPS"                : 0
		},

		"Upgrades" : {					// _playerState["Upgrades"]["Shovel"]["upgradeable"]
			"Shovel"       : { "level" : 0, "lock" : true , "upgradeable" : false },
			"Baby"         : { "level" : 0, "lock" : false, "upgradeable" : false },
			"Moo Moo Farm" : { "level" : 0, "lock" : false, "upgradeable" : false },
			"Bathroom"     : { "level" : 0, "lock" : false, "upgradeable" : false }
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
		_window.current = newWindow;

		if( _window.previous != "" ) {
			document.getElementById( _window.previous ).style.display = "none";
		}

		document.getElementById( _window.current ).style.display = "block";
	}

	function curWindow( ) { return _window.current; }



	//=======================================================
	// [x] Session State - Timer
	//=======================================================
	function setTimer( timeObj ) { _runTime = timeObj; }
	function getTimer( ) { return _runTime; }
	function addTimer( ) { _runTime = new ED_Timer( ); }



	//=======================================================
	// [x] Session State - Poo Statistics
	//=======================================================
	function addPoo( quantity )      { _totalPooCollect += quantity; }
	function subtractPoo( quantity ) { _totalPooCollect -= quantity; }
	function getTotalPoo( ) { return _totalPooCollect; }
	function addClick( quantity ) { _totalClicksMade += quantity; }
	function getTotalClicks( ) { return _totalClicksMade; }
	function addPooSinceStart( quantity ) { _totalPooSinceStart += quantity; }
	function getPooSinceStart( ) { return _totalPooSinceStart; }
	function getPPS( ) { return _PPS; }


	//=======================================================
	// [x] Session State - Upgrade Statistics
	//=======================================================
	function upgradeLevelUp( name ) { _upgradeList[name]["level"]++; }
	function getLevel( name ) { return _upgradeList[name]["level"]; }
	
	function getUpgradeList( ) { return _upgradeList; }
	function calcPPS( ) { _PPS = UpgradeData.calcAllPPS( _upgradeList ); }

	function isUpgradePurchaseable( name ) {
		let upgradeCost = UpgradeData.calcPrice( name, _upgradeList[name]["level"] );

		if( upgradeCost <= _totalPooCollect ) {
			_upgradeList[name]["upgradeable"] = true;
		} else {
			_upgradeList[name]["upgradeable"] = false;
		}

		return _upgradeList[name]["upgradeable"];
	}

	function isUpgradeUnLock( name ) { 
		return _upgradeList[name]["lock"]; 
	}

	function upgradeToggle( ) {
		for( key in _upgradeList ) {
			isUpgradePurchaseable( key );
		}
	}

	function isUpgradeEligible( ) {
		let retValue    = false;
		let upgradeData = UpgradeData.upgrade;

		//CHECK IF NEXT TIRE UPGRADE IS ELIGIBLE
		for( key in UpgradeData.upgrade ) {
			if( _upgradeList[key]["lock"] != true 
				&& _totalPooCollect >= ( 0.9 * UpgradeData.upgrade[key]["base"] ) ) {
				_upgradeList[key]["lock"] = true;
				retValue = true;
			}
		}

		return retValue;
	}


	//=======================================================
	// [x] Save Keys Methods - Complete
	//=======================================================
	function newSlot( newSlot ) { _storageKey = newSlot; }
	function saveSlot( ) { return _storageKey; }	

	function setFromSaveSlot( slotID, slotData ) {
		_storageKey = slotID;
		_quickKey   = "quickSlot";
		_window     = { current : "page2", previous : "" };

		//==============================================
		// LOADING TIMER
		//==============================================
		for( keys in slotData["TimeRan"] ) {
			let temp = new ED_Timer( );
			temp.createFromJSON( slotData["TimeRan"][keys] );
			_runTime = temp;

			_playerState["GameTime"]["seconds"] = temp;
		}




		//==============================================
		// LOADING UPGRADES
		//==============================================
		for( key in slotData["upgrade"] ) {
			_upgradeList[key] = slotData["upgrade"][key];

			_playerState["Upgrades"][key] = slotData["upgrade"][key];
		}

		upgradeToggle( );
		isUpgradeEligible( );


		//==============================================
		// LOADING STATISTICS
		//==============================================
		let i = "Statistics";
		for( keys in slotData[i] ) {
			switch( keys ) {
				case "TotalPooCollect":
					slotData[i]["TotalPooCollect"] == undefined ? 0 : _totalPooCollect = slotData[i]["TotalPooCollect"];
					_playerState[i]["TotalPooCollect"] = slotData[i]["TotalPooCollect"];
				break;

				case "TotalClicksMade":
					slotData[i]["TotalClicksMade"] == undefined ? 0 : _totalClicksMade = slotData[i]["TotalClicksMade"];
					_playerState[i]["TotalClicksMade"] = slotData[i]["TotalClicksMade"];
				break;

				case "TotalPooSinceStart":
					slotData[i]["TotalPooSinceStart"] == undefined ? 0 : _totalPooSinceStart = slotData[i]["TotalPooSinceStart"];
					_playerState[i]["TotalPooSinceStart"] = slotData[i]["TotalPooSinceStart"];
				break;
			}			
		}

		_PPS = UpgradeData.calcAllPPS( _upgradeList );
		_playerState[i]["PPS"] = UpgradeData.calcAllPPS( _upgradeList );
	}


	function saveTimeRan( ) {
		return { "TimeRan" : _runTime.toJSON( ) };
	}

	function savePoo( ) { 
		return { 
			"Statistics" : {
				"TotalPooCollect" 	 : _totalPooCollect,
				"TotalClicksMade" 	 : _totalClicksMade,
				"TotalPooSinceStart" : _totalPooSinceStart
			}
		};
	}

	function saveUpgrade( ) {
		return { "upgrade" : _upgradeList };
	}


	function savePlayerState( ) {
		return _playerState;
	}

	//=======================================================
	// [x] Session State - Loading & Reset
	//=======================================================
	function reset( ) {
		_storageKey 	 	= "tempSlot";
		_quickKey   	 	= "quickSlot";
		_window     	    = { current : "page1", previous : "" };
		_runTime    	    = {};
		_totalPooCollect    = 0;
		_totalClicksMade    = 0;
		_totalPooSinceStart = 0;
		_PPS				= 0;

		_upgradeList = {
			"Shovel"       : { "level" : 0, "lock" : true , "upgradeable" : false  },
			"Baby"         : { "level" : 0, "lock" : false, "upgradeable" : false  },
			"Moo Moo Farm" : { "level" : 0, "lock" : false, "upgradeable" : false  },
			"Bathroom"     : { "level" : 0, "lock" : false, "upgradeable" : false  }
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
			console.log( "Seconds: " + _runTime.seconds( ) );
			console.log( "T. Poo Collect: " + _totalPooCollect );
			console.log( _upgradeList );
			console.log( "Total Clicks: " + _totalClicksMade );
			console.log( "Poo Collected since Start: " + _totalPooSinceStart );
			console.log( "Poo Per Second: " + _PPS );
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
		setTimer    : setTimer,
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
		saveTimeRan 	: saveTimeRan,
		savePoo     	: savePoo,
		saveUpgrade 	: saveUpgrade,
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