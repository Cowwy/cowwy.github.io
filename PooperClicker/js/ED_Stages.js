//=======================================================
// Build Version 1.0 - Junly 1, 2019
//=======================================================
// -> Added ED_Stage_Setup( ) function.
// -> Added ED_Navigation** function.
//=======================================================

//=======================================================
// Build Version 1.0 - Junly 6, 2019
//=======================================================
// All Pages are connected.  It can dyanmically
// add controls and remove controls.
//
// [TO DO] - Hero Object
// [TO DO] - Translate Hero Data to JSON
//=======================================================



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


		page4 : function( ) {
			SessionState.debug( );	//DELETE ME

			//=================================================
			// Add Navigation and Action control to the window.
			//=================================================
			var p4_saveBtn        = document.getElementById( "p4-saveBtn" );
			var p4_endBtn         = document.getElementById( "p4-endBtn" );
			var upgradeTabBtn     = document.getElementById( "upgradeTabBtn" );
			var techTabBtn        = document.getElementById( "techTabBtn" );
			var statisticTabBtn   = document.getElementById( "statisticTabBtn" );
			var achievementTabBtn = document.getElementById( "achievementTabBtn" );
			var buyBtn            = document.getElementById( "buyBtn" );
			var sellBtn			  = document.getElementById( "sellBtn" );

			p4_saveBtn.addEventListener( "click", 	  p4_onClick_Save );
			p4_saveBtn.addEventListener( "mouseover", p4_mouseOver );

			p4_endBtn.addEventListener( "click", 	 p4_onClick_End );
			p4_endBtn.addEventListener( "mouseover", p4_mouseOver );

			upgradeTabBtn.addEventListener( "click", switchTab );
			techTabBtn.addEventListener( "click", switchTab );
			statisticTabBtn.addEventListener( "click", switchTab );
			achievementTabBtn.addEventListener( "click", switchTab );

			buyBtn.addEventListener( "click", function( ) {
				
			});

			

			//=================================================
			// Initialize Game State
			//=================================================
			{
				var pooClicker = document.getElementById( "pooClicker" );
				    pooClicker.addEventListener( "click", poo_onClick );
					
				//=========================================
				// Enter Main-Game [Stage]
				//=========================================
				var currentTime 	   = document.getElementById( "currentTime" );
				var totalPooCol 	   = document.getElementById( "totalPooCollected" );
				var totalClicks 	   = document.getElementById( "totalClicksMade" );
				var pooDisplay  	   = document.getElementById( "totalPooDisplay" );
				var ppsDisplay  	   = document.getElementById( "ppsDisplay" );
				var totalPooSinceStart = document.getElementById( "totalPooSinceStart" );
				var updateTimer 	   = setInterval( gameLoop, 10 );

				updateStatistics( );				//SET STATISTICS VISUAL
				generateList( );					//SET UPGRADE LIST VISUAL
				SessionState.getTimer( ).start( );	//START GAME TIMER

				function gameLoop( ) {
					//UPDATE POO ACCUMULATION
					SessionState.addPoo( SessionState.getPPS( ) / 100 );

					//UPDATE STATISTICS SCREEN
					updateStatistics( );


					//TOGGLE "ANY" UPGRADE THAT IS PURCHASEABLE
					//CHANGE CSS ON UPGRADE THAT IS PURCHASEABLE
					SessionState.upgradeToggle( );
					let upgradeList = SessionState.getUpgradeList( );
					
					


					for( key in upgradeList ) {
						//IF IT IS NOT LOCKED - DO SOMETHING
						//ELSE - DO NOTHING
						if( upgradeList[key]["lock"] != false ) {
							if( upgradeList[key]["upgradeable"] ) {
								let tempTitle = document.getElementById( key + "Title" );
									tempTitle.setAttribute( "class", "label" );

								let tempCost  = document.getElementById( key + "Cost" );
									tempCost.setAttribute( "class", "cost purchaseable" );

							} else {
								let tempTitle = document.getElementById( key + "Title" );
									tempTitle.setAttribute( "class", "label notPurchaseable" );

								let tempCost  = document.getElementById( key + "Cost" );
									tempCost.setAttribute( "class", "cost notPurchaseable" );
							}
						}
					}

					//CHECK IF NEXT TOOL IS AVAILABLE FOR UPGRADE
					if( SessionState.isUpgradeEligible( ) ) {
						generateList( );
					}
				}
			}


			//=======================================================
			// Endless Dungeon Page3 Button Action
			//=======================================================
			function p4_mouseOver( e )    { e.srcElement.style.cursor = "Pointer"; }

			function p4_onClick_Save( e ) {	
				SaveData.saveToLocalStorage( );	

				pooArea = document.getElementById( "pooClickerBody" );

				//Add div element with the number pop up
				//Div moves up over 1 seconds and disappears after 1 seconds
				//absolute position it.
				let tempDiv = document.createElement( "div" );
				let txtNode = document.createTextNode( "GAME SAVED!" );

				tempDiv.setAttribute( "class", "SaveMsgBox" );
				tempDiv.style.opacity = 1.0;

				tempDiv.appendChild( txtNode );
				pooArea.appendChild( tempDiv );

				var tempTimer = new StatusTimer( tempDiv );
				tempTimer.start( );
			}

			function p4_onClick_End( e ) {
				//====================================
				// REMOVE ALL LISTENENERS ON THE PAGE
				//====================================
				p4_saveBtn.removeEventListener( "click", 	 p4_onClick_Save );
				p4_endBtn.removeEventListener(  "click", 	 p4_onClick_End );
				p4_saveBtn.removeEventListener( "mouseover", p4_mouseOver );
				p4_endBtn.removeEventListener(  "mouseover", p4_mouseOver );
				pooClicker.removeEventListener( "click", poo_onClick );
				upgradeTabBtn.removeEventListener( "click", switchTab );
				techTabBtn.removeEventListener( "click", switchTab );
				statisticTabBtn.removeEventListener( "click", switchTab );
				achievementTabBtn.removeEventListener( "click", switchTab );


				ED_Stages( ).setStage( e.srcElement.attributes["data-target"].value );
				SessionState.changeStageTo( e.srcElement.attributes["data-target"].value );


				//END GAME TIMER
				SessionState.getTimer( ).end( );
				clearInterval( updateTimer );

				//SAVE PROGRESS
				SaveData.saveToLocalStorage( );

				//RESET SESSION STATE FOR THE NEXT GAME
				SessionState.reset( );
				resetTab( );
			}


			function resetTab( ) {
				UpgradeData.getUpgradeTabs( ).forEach( function(element) {
					let header = element + "Btn";
					let title = document.getElementById( header ).innerHTML;

					document.getElementById( element ).style.display = "block";
					document.getElementById( header ).innerHTML = title.replace( "-", "+" );
				});
			}


			function switchTab( e ) {
				let txt = ( e.srcElement.innerHTML ).replace( "+", "-" );
				let id = ( e.srcElement.id ).replace( "Btn", "" );
				let element = document.getElementById( id );

				if( element.style.display == "block" ) {
					element.style.display = "none";
					e.srcElement.innerHTML = ( e.srcElement.innerHTML ).replace( "+", "-" );

				} else {
					element.style.display = "block";
					e.srcElement.innerHTML = ( e.srcElement.innerHTML ).replace( "-", "+" );
				}
			}


			function updateStatistics( ) {
				currentTime.innerHTML 		 = SessionState.getTimer( ).elapsedToString( );
				totalPooCollected.innerHTML  = Math.round( SessionState.getTotalPoo( ) );
				totalClicks.innerHTML        = SessionState.getTotalClicks( );
				totalPooSinceStart.innerHTML = SessionState.getPooSinceStart( );

				pooDisplay.innerHTML         = Math.round( SessionState.getTotalPoo( ) ) + " POOPS";

				if( SessionState.getPPS( ) == 0 ) { 
					ppsDisplay.innerHTML = "per second: " + 0; 

				} else if( SessionState.getPPS( ) < 100 ) {
					let pps = (SessionState.getPPS( )).toFixed(2);
					ppsDisplay.innerHTML = "per second: " + pps; 
				} else {
					ppsDisplay.innerHTML = "per second: " + Math.round( SessionState.getPPS( ) );
				}
			}

			function generateList( ) {
				var upgradeContainer = document.getElementById( "upgradeList" );
				    upgradeContainer.innerHTML = "";

				SessionState.upgradeToggle( );
				SessionState.isUpgradeEligible( );

				for( key in UpgradeData.upgrade ) {
					if( SessionState.isUpgradeUnLock( key ) ) {
						//===================
						// DIV ELEMENT
						//===================
						let cell = document.createElement( "div" );
						    cell.setAttribute( "class", "upgradeCell" );
						    cell.setAttribute( "id", key + "Upgrade" );

						//===================
						// IMG ELEMENT
						//===================
						let img = document.createElement( "img" );
						    img.setAttribute( "id", key + "Img" );

						    switch( key ) {
						    	case "Shovel":
						    		img.setAttribute( "src", "img/shovel128x128.png" );	
						    	break;

						    	case "Baby":
						    		img.setAttribute( "src", "img/baby128x128.png" );	
						    	break;

						    	case "Animal Farm":
						    		img.setAttribute( "src", "img/moomoofarm128x128.png" );	
						    	break;

						    	case "Toilet":
						    		img.setAttribute( "src", "img/toilet128x128.png" );	
						    	break;

						    	default:
						    		img.setAttribute( "src", "img/shovel128x128.png" );	
						    	break;
						    }
						    

						//=======================
						// SPAN ELEMENT - TITLE
						//=======================
						let title = document.createElement( "span" );
						    title.setAttribute( "id", key + "Title" );

						if( SessionState.isUpgradePurchaseable( key ) ) {
							title.setAttribute( "class", "label" );
						} else {
							title.setAttribute( "class", "label notPurchaseable" );
						}
						
						title.innerHTML = key;


						//=======================
						// SPAN ELEMENT - COST
						//=======================
						let cost = document.createElement( "span" );
							cost.setAttribute( "id", key + "Cost" );

							if( SessionState.isUpgradePurchaseable( key ) ) {
								cost.setAttribute( "class", "cost purchaseable" );
							} else {
								cost.setAttribute( "class", "cost notPurchaseable" );
							}

							cost.innerHTML = UpgradeData.calcPrice( key, SessionState.getLevel( key ) );

						//=======================
						// SPAN ELEMENT - LEVEL
						//=======================
						let level = document.createElement( "span" );
							level.setAttribute( "id", key + "Level" );
							level.setAttribute( "class", "level" );
							level.innerHTML = SessionState.getLevel( key );

						//=======================
						// DIV ELEMENT - Overlay
						//=======================
						let overlay = document.createElement( "div" );
							overlay.setAttribute( "id", key );
							overlay.setAttribute( "class", "overlay" );

						//=======================
						// CREATE CELL
						//=======================
						cell.appendChild( img );
						cell.appendChild( title );
						cell.appendChild( cost );
						cell.appendChild( level );
						cell.appendChild( overlay );
						upgradeContainer.appendChild( cell );


						//=======================
						// ADD EVENT LISTENER
						//=======================
						cell.addEventListener( "click", upgradeLevel );				


						//=======================
						// EVENT METHOD
						//=======================
						function upgradeLevel( e ) {
							let id    = e.srcElement.id

							//===========================================
							// Check Clicked Upgrade Afforadability
							//===========================================
							if( SessionState.isUpgradePurchaseable( id ) ) {
								//-Poo from Total Collected
								let pooStats  = document.getElementById( "totalPooCollected" );
								SessionState.subtractPoo( UpgradeData.calcPrice( id, SessionState.getLevel( id ) ) );
								pooStats.innerHTML = SessionState.getTotalPoo( );

								//Increase Level +1
								SessionState.upgradeLevelUp( id );
								let level = document.getElementById( id + "Level" );
								level.innerHTML = SessionState.getLevel( id );

								//Recalculate Cost
								let cost  = document.getElementById( id + "Cost" );					
								cost.innerHTML = UpgradeData.calcPrice( id, SessionState.getLevel( id ) );

								//Calculate the new PPS
								SessionState.calcPPS( );

								//Calculate if you have enough Poo for next upgrade
								SessionState.isUpgradePurchaseable( id )
							}
						}
					}
				}
			}

			function poo_onClick( e ) {
				var pooArea = document.getElementById( "pooArea" );

				//Add div element with the number pop up
				//Div moves up over 1 seconds and disappears after 1 seconds
				//absolute position it.
				let tempDiv = document.createElement( "div" );
				let txtNode = document.createTextNode( "+1" );

				tempDiv.setAttribute( "class", "pooClicked" );
				tempDiv.style.left = between(e.offsetX - 24, e.offsetX + 56) + "px";
				tempDiv.style.top  = (e.offsetY-50) + "px";
				tempDiv.style.opacity = 1.0;

				tempDiv.appendChild( txtNode );
				pooArea.appendChild( tempDiv );

				var tempTimer = new PooNumber( tempDiv );
				tempTimer.start( );

				SessionState.addPoo( 1 );
				SessionState.addClick( 1 );
				SessionState.addPooSinceStart( 1 );
			}


		} // END OF PAGE 4 - IN GAME SCREEN
	}


	function setStage( stageID ) {
		stage[ stageID ]( );
	}

	return {
		setStage : setStage
	};
}

