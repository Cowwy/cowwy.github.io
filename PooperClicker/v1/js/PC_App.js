// =======================================================
//  GLOBAL letIABLES - REQUIRED
// =======================================================
const copyright = {
	"gameName" : "Pooper Clicker",
	"version"  : "DEMO",
	"dateFrom" : 2019,
	"dateTo"   : 2019,
	"Author"   : "Cowwy"
};

const $ST    		  = new AppSessionState( );		//PLAYER'S CURRENT STATE
const $D 			  = new DOM( );					//LIKE JQUERY
const SaveData        = new App_SaveState( );		//ACCESS TO SAVE/LOAD
const PooClickerData  = new GameData( );
const GameUtility 	  = new GameUtilityAPI( );

const hackMode        = false;
const hackClickAmt    = 25;
const FPS             = 50;

let	  updateTimer     = null;
let   windowIsFocus   = true;

window.onblur  = function( ) { windowIsFocus = false; }
window.onfocus = function( ) { windowIsFocus = true; }

Object.freeze( PooClickerData );
Object.freeze( GameUtility );
Object.freeze( copyright );


// =======================================================
//  MAIN - START OF THE PROGRAM
// =======================================================
function AppInit( ) {
	headerSetup( );			// Setting up header information
	devNoteControlSetup( );	// DOCUMENTATION CONTROLS

	initPanelControl( );	// PANEL CONTROLS
	initPooStoreContorl( );	// POO STORE
	initSettingControl( );	// SETTING
	initGameControls( );	// MAIN GAME AREA
	initSessionState( );	// Session State

	enterGame( );
}


function enterGame( ) {
	//=========================================
	// Enter Main-Game [Stage]
	//=========================================
	let chevoUpdateFreq    = FPS * 1;		//NUMBER OF FRAMES ELAPSED
	let chevoCurrentFreq   = 0;

	let msgUpdateFreq      = FPS * 12.5;	//Every 12.5 Seconds
	let msgCurrentFreq     = 0;

	let sessionTimeFreq    = FPS * 1;  		//Every 1.0 Seconds
	let sessionCurFreq     = 0;

	let outOfFocusFrame    = 0;

	//START GAME TIMER | MESSAGE BOARD | WORLD NAME 
	//POO STORE | TECH TREE | STATISTICS | CHEVO
	startGame( );

	//ENTERED GAME LOOP
	updateTimer = setInterval( ( ) => {

		if( windowIsFocus ) {
			if( outOfFocusFrame > 0 ) {
				updateWindowInFocus( outOfFocusFrame );
				outOfFocusFrame = 0;	

				//RESET WORLD MSSAGE
				enableMsg( );
				msgCurrentFreq  = 0;
			}

			//POOP PER SECOND ADDED
			$ST.addPoo( $ST.getPPS( ) / FPS );

			//===================================================
			// CHECK IF PLAYER HAS ENOUGH POO TO PURCHASE THE
			// NEXT LEVEL OF UPGRADE.  FOR EXAMPLE: SHOVEL 11
			//
			// THIS NEEDS TO BE CHECKED EVERY GAME LOOP
			// BECAUSE OF POO PER SECOND.
			//===================================================
			updatePurchaseAvailability( );
			
			//UPDATE POO STORE LIST - ONLY IF SOMETHING NEW IS AVAILABLE
			$ST.isUpgradeEligible( ) && updatePooStore( );

			//UPDATE STATISTICS SCREEN
			updateStatistics( );									
			
			//CHECK IF ACHIEVEMENT HAS BEEN UNLOCKED
			//ONLY UPDATE ONCE EVERY 1.0 sec
			if( chevoCurrentFreq === chevoUpdateFreq ) {
				//CHECK TO SEE IF NEW ACHIEVEMENT IS UNLOCKED.
				const achievementPopUp = updateAchievementNotification( );

				// ALSO UPDATE ACHIEVEMENT TAB TO REFLECT RECENT UNLOCK
				if( achievementPopUp >= 1 ) { updateAchievementScreen( );	}

				chevoCurrentFreq = 0;
			}

			//UPDATE WORLD MESSAGE / 12.5 sec
			if( msgCurrentFreq === msgUpdateFreq ) {
				msgCurrentFreq = 0;
				updateMessageBoard( );
			}

			//UPDATE CURRENT GAME RUN TIME / 1.0 sec
			if( sessionCurFreq === sessionTimeFreq ) {
				sessionCurFreq = 0;
				updateGameTime( 1 );
				updateBrowserTitle( );
			}

			chevoCurrentFreq++;		//CONTROL HOW FREQUENT ACHIEVEMENT UPDATE GETS CHECKED
			msgCurrentFreq++;
			sessionCurFreq++;	
		}

		if( !windowIsFocus ) {
			outOfFocusFrame++;
			disableMsg( );
			updateWindowOutofFocus( outOfFocusFrame );
		}
	}, 1000/FPS );
}


// =======================================================
//  FUNCTION 	startGame
//  Initial Game Setup - Before game can start
// =======================================================
function startGame( ) {
    $D.id( "nameInput" ).value = $ST.getWorldName( );	//SET WORLD NAME

    //Initial Update => Upgrade | Tech | Achievement | Statistics
    updatePooStore( );		//SET UPGRADE LIST VISUAL
    updateTechTree( ); 		//SET TECH TREE ICON VISUAL
    updateStatistics( );	//SET STATISTICS VISUAL
	updateAchievementScreen( );	//GENERATE ACHIEVEMENTS
	
	$ST.debug( "startGame( )" );
}