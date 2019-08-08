//=======================================================
// SessionState
// Keeps track of the play's overall progression.
//
// Information currently holds.
//		1 - Current window that a player is at.
//		2 - Character Data
//=======================================================
var SessionState    = new AppSessionState( );
var EventRegistry   = new AppEventRegistry( );
var SaveData        = new App_SaveState( );

const UpgradeData   = new UpgradeList( );

//=======================================================
// EndlessDungeon.js
// Entire Game Object that contains everything about the
// game.
//=======================================================
function EndlessDungeon( ) {
	ED_Stage_Setup( );
}

//Factor - Price increment  
//Base - Base price 		Base increase by 3x   price as previous
//PPS - Poo Per Second      PPS  increase by 1.5x than previous
function UpgradeList( ) {
	const upgrade = {
		"Shovel"       : { "factor" : 0.20, "base" :     15,   "PPS" :   0.10 },
		"Baby"         : { "factor" : 0.20, "base" :    100,   "PPS" :   1.00 },
		"Animal Farm"  : { "factor" : 0.20, "base" :   2500,   "PPS" :   3.00 },
		"Toilet"       : { "factor" : 0.20, "base" :  20000,   "PPS" :  14.00 }
	};

	const upgradeTabs = ["upgradeTab", "techTab", "statisticTab", "achievementTab"];

	function calcPrice( name, level ) {
		let key = upgrade[name];
		return Math.round( Math.pow((1 + key["factor"]), level ) * key["base"] );
	}

	function calcAllPPS( upgradeList ) {
		let totalPPS = 0.0;

		for( key in upgradeList ) {
			let level = upgradeList[key]["level"]
			totalPPS += level * upgrade[key]["PPS"];
		}

		return totalPPS;
	}

	function getUpgradeTabs( ) { return upgradeTabs; }
	function getUpgradeHead( ) { return upgradeHead; }

	return {
		upgrade        : upgrade,
		calcPrice      : calcPrice,
		calcAllPPS     : calcAllPPS,
		getUpgradeTabs : getUpgradeTabs,
		getUpgradeHead : getUpgradeHead
	}
}

function between( low, high ) {
	return Math.round( low + Math.random( ) * (high-low) );
}