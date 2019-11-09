var hackMode     = false;
var hackClickAmt = 250000;

// var msgTimer 	 = 12500;
var autoSave     = false;

// console.log( String( hackClickAmt ) );

//=======================================================
// ED_Stage_Setup( )
// Responsible for staging all the button controls 
// within each screen or window.
//=======================================================
function ED_Stage_Setup( ) {
	ED_Stages( ).setStage( SessionState.getCurWindow( ) );
}



//=======================================================
// ED_Stages( )
//	-> ED_Stages( ).setStage( [stageID] )		//Sets up the stage with controls
//
// Information about all the stages will be recorded
// here.  To construct each individual stage with their
// appropriate controls.  A function call to a specific
// page is all is needed.
//=======================================================
function ED_Stages( ) {
	let stage = {
		//=================================
		// START OF PAGE 1 - Splash Screen
		//=================================
		page1 : function( ) {
			let p1_newGameBtn  = document.getElementById( "p1-newGameBtn" );
			let p1_loadGameBtn = document.getElementById( "p1-loadGameBtn" );

			//=================================================================
			// Add & Register Navigation and Action control to the window.
			//=================================================================
			p1_newGameBtn.addEventListener(  "click", 	  p1_onClick );
			p1_loadGameBtn.addEventListener( "click",     p1_onClick );
			p1_newGameBtn.addEventListener(  "mouseover", p1_mouseOver );
			p1_loadGameBtn.addEventListener( "mouseover", p1_mouseOver );


			//==================================
			// Change to Stage1 - Splash Screen
			// REQUIRE!! All stage is display non
			// Only P1 needs this line of code.
			//==================================
			SessionState.changeStageTo( "page1" );	//Change Screen None-Block


			//=======================================================
			// Endless Dungeon Button Controls
			//=======================================================
			function p1_mouseOver( e ) { e.srcElement.style.cursor = "Pointer";	}

			function p1_onClick( e ) {
				//===============================================
				// Automatically Create a Hero for the game
				// Player can customize the Hero during gameplay
				//===============================================
				SessionState.addTimer( );

				//====================================
				// Remove all the controls from Page1
				//====================================
				p1_newGameBtn.removeEventListener(  "click", 	 p1_onClick );
				p1_loadGameBtn.removeEventListener( "click", 	 p1_onClick );
				p1_newGameBtn.removeEventListener(  "mouseover", p1_mouseOver );
				p1_loadGameBtn.removeEventListener( "mouseover", p1_mouseOver );

				//======================
				// Setup page4 controls
				//======================
				ED_Stages( ).setStage( e.srcElement.attributes["data-target"].value );

				//====================================
				// Change window from Page1 to Page4
				//====================================
				SessionState.changeStageTo( e.srcElement.attributes["data-target"].value );
			}
		},	//END OF - PAGE1 - Object



		//=================================
		// START OF PAGE 2 - Load Screen
		//=================================
		page2 : function( ) {
			var p2_backBtn = document.getElementById( "p2-backBtn" );

			//=========================================================
			// Add Navigation and Action control to the window.
			//=========================================================
			p2_backBtn.addEventListener( "click", 	  p2_onClick );
			p2_backBtn.addEventListener( "mouseover", p2_mouseOver );

			//=========================================================
			// EventRegistry is necessary to remove the eventListener
			// outside of this function.
			//=========================================================
			EventRegistry.add( "p2-backBtn", "click", p2_onClick );
	    	EventRegistry.add( "p2-backBtn", "mouseover", p2_mouseOver );


			//=========================================
			// Search Local Storage for all save data &
			// Add elements to the load screen
			//=========================================
			SaveData.loadFromLocalStorage( );

			//=======================================================
			// Endless Dungeon Button Controls
			//=======================================================
			function p2_mouseOver( e ) { e.srcElement.style.cursor = "Pointer";	}

			function p2_onClick( e ) {
				p2_backBtn.removeEventListener( "click", 	 p2_onClick );
				p2_backBtn.removeEventListener( "mouseover", p2_mouseOver );
				
				ED_Stages( ).setStage( e.srcElement.attributes["data-target"].value );
				SessionState.changeStageTo( e.srcElement.attributes["data-target"].value );
				SaveData.unload( );
			}
		}, //END OF - PAGE2 - Load Screen



		//==================================
		// START OF PAGE 4 - In Game Screen
		//==================================
		page4 : function( ) {	
		} // END OF PAGE 4 - IN GAME SCREEN
	}


	function setStage( stageID ) {
		stage[ stageID ]( );
	}

	return {
		setStage : setStage
	};
}

