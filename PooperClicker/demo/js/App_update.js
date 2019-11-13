//UPDATE THE NUMBERS WITHIN STATISTICS
function updateStatistics( ) {
    let totalPooText  = SessionState.getDisplayNotation( "totalPoo" );
    let pooSinceStart = SessionState.getDisplayNotation( "pooSinceStart" );

    let currentTime 	   = document.getElementById( "currentTime" );			//STATISTICS TAB
	let totalPooCol 	   = document.getElementById( "totalPooCollected" );	//STATISTICS TAB
	let totalClicks 	   = document.getElementById( "totalClicksMade" );		//STATISTICS TAB
	let totalPooSinceStart = document.getElementById( "totalPooSinceStart" );	//STATISTICS TAB
	let totalUpgrades      = document.getElementById( "totalUpgrades" );		//STATISTICS TAB
	
    let ppsDisplay  	   = document.getElementById( "ppsDisplay" );			//Center Stage
    let pooDisplay  	   = document.getElementById( "totalPooDisplay" );		//Center Stage

    //TIMER
    currentTime.innerHTML 		 = SessionState.getTimer( ).elapsedToString( );
    
    //PLAYER'S ACTION SCORE
    totalClicks.innerHTML        = SessionState.getTotalClicks( );

    //UPGRADE SCORES
    totalUpgrades.innerHTML      = SessionState.getTotalUpgrade( );

    //PLAYER'S POO SCORES
    totalPooCollected.innerHTML  = totalPooText;
    totalPooSinceStart.innerHTML = pooSinceStart;

    //SCORE DISPLAY
    pooDisplay.innerHTML         = totalPooText + " POOPS";


    if( SessionState.getPPS( ) == 0 ) { 
        ppsDisplay.innerHTML = "per second: " + 0; 

    } else if( SessionState.getPPS( ) < 100 ) {
        let pps = (SessionState.getPPS( )).toFixed(2);
        ppsDisplay.innerHTML = "per second: " + pps; 
    } else {
        ppsDisplay.innerHTML = "per second: " + Math.round( SessionState.getPPS( ) );
    }
}


//GENERATE UPGRADE LIST [HANDS][SHOVEL][ETC]
//ONLY CALL WHEN SOMETHING NEW IS UNLOCK
function generateList( ) {
    let upgradeContainer = document.getElementById( "upgradeList" );
        upgradeContainer.innerHTML = "";

    SessionState.upgradeToggle( );
    SessionState.isUpgradeEligible( );

    for( key in PooClickerData.upgrade ) {
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
                    case "Hand":
                        img.setAttribute( "src", "img/handOpen128x128.png" );	
                    break;

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

            let sum = PooClickerData.calcPrice( key, SessionState.getLevel( key ) );
                cost.innerHTML = SessionState.getDisplayNotation( sum );

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
                // Check Clicked Upgrade Afforadability - Buy
                //===========================================
                if( SessionState.getBuyOrSell( ) ) {
                    if( SessionState.isUpgradePurchaseable( id ) ) {
                        //-Poo from Total Collected
                        let pooStats  = document.getElementById( "totalPooCollected" );
                        SessionState.subtractPoo( PooClickerData.calcSumPrice( id, SessionState.getLevel( id ), SessionState.getBuyOrSellQuantity( ) ) );
                        pooStats.innerHTML = SessionState.getDisplayNotation( "totalPoo");

                        //Increase Level +Quantity
                        SessionState.upgradeLevelUp( id, SessionState.getBuyOrSellQuantity( ) );
                        let level = document.getElementById( id + "Level" );
                        level.innerHTML = SessionState.getLevel( id );

                        //Recalculate Cost
                        let cost  = document.getElementById( id + "Cost" );	
                        let sum   = PooClickerData.calcSumPrice( id, SessionState.getLevel( id ), SessionState.getBuyOrSellQuantity( ) );			
                        cost.innerHTML = SessionState.getDisplayNotation( sum );

                        //Calculate the new PPS
                        SessionState.calcPPS( );

                        //Calculate if you have enough Poo for next upgrade
                        SessionState.isUpgradePurchaseable( id )
                    }
                }
                

                //=============================================
                // Check Clicked Upgrade Afforadability - Sell
                //=============================================
                else {
                    // SELL UPGRADE AND ADD ONTO TOTAL POO
                    let pooStats = document.getElementById( "totalPooCollected" );
                    SessionState.addPoo( PooClickerData.calcSellPrice( id, SessionState.getLevel( id ), SessionState.getBuyOrSellQuantity( ) ) );
                    pooStats.innerHTML = SessionState.getTotalPoo( );

                    //===============================
                    // Decrease Level -Quantity
                    //===============================
                    //IF QUANTITY AMOUNT IS GREATER THAN CURRENT LEVEL
                    //SET LEVEL TO 0
                    if( SessionState.getBuyOrSellQuantity( ) > SessionState.getLevel( id ) ) {
                        SessionState.upgradeLevelDown( id, SessionState.getLevel( id ) );
                    }

                    //ELSE -QUANTITY
                    else {
                        SessionState.upgradeLevelDown( id, SessionState.getBuyOrSellQuantity( ) );
                    }

                    let level = document.getElementById( id + "Level" );
                    level.innerHTML = SessionState.getLevel( id );
                    
                    //===============================
                    // Recalculate Cost
                    //===============================
                    let cost  = document.getElementById( id + "Cost" );	
                    cost.innerHTML = PooClickerData.calcSellPrice( id, SessionState.getLevel( id ), SessionState.getBuyOrSellQuantity( ) );


                    //Calculate the new PPS
                    SessionState.calcPPS( );

                    //Calculate if you have enough Poo for next upgrade
                    SessionState.isUpgradePurchaseable( id )
                }

                generateTechTreeIcon( );
                PooClickerData.getMessageBoardUpdate( );
            }
        }
    }
}


//GENERATE TECH TREE ICON BASED ON UPGRADE THAT IS RECENTLY
//UNLOCK. 
function generateTechTreeIcon( ) {
    let techTreeContainer = document.getElementById( "techList" );
    let techTreeArray     = PooClickerData.getPurchasbleTechTreeUpgrade( );

    //CLEAR TECH TREE ICONS
    techTreeContainer.innerHTML = "";

    //CONSTRUCT ICONS WITH UPGRADES THAT YOU DON'T HAVE.
    techTreeArray.forEach( function(element) {
        //CLONE TEMP TECHTREE ICON
        let clone = document.getElementById( "tempTechIcon" ).cloneNode( true );

        //ASSIGN CLONES WITH NEW INFORMATION
        clone.id               			= "tech" + element;
        clone.style.background 			= "url('img/" + PooClickerData.getTechSprite( element ) + "')";
        clone.style.backgroundRepeat  	= "no-repeat";
        clone.style.display    			= "block";

        //ADD EVENTLISTENERS TO RESPONDE TO CLICKING
        //ADD EVENTREGISTRY IF NEEDED TO REMOVE EVENTLISTENER
        clone.addEventListener( "click", function( ) {
            let id       = (this.id).replace("tech", "" );
            let techCost = PooClickerData.getTechCost( id );

            //MAKE SURE THAT THE TECH IS PURCHASEABLE
            if( SessionState.getTotalPoo( ) >= techCost ) {
                let techTipBoxClone = document.getElementById( "clone" );

                SessionState.setTechPurchased( id );	//MARK TECHTREE PURCHASED (TRUE)
                SessionState.subtractPoo( techCost );	//SUBTRACT THE COST FROM TOTAL POO POOL

                SessionState.calcTechPPSBonus( );		//RECALCULATE ALL THE PPS BONUS

                techTreeContainer.removeChild( this );	//REMOVE TECH ICON FROM THE TECH LIST

                if( techTipBoxClone ) {
                    techTipBoxClone.parentNode.removeChild( techTipBoxClone );
                }

                //Calculate the new PPS
                SessionState.calcPPS( );
            }
        });

        //WHEN PLAYER MOVE MOUSE OVER AN TECH UPGRADE
        //POP UP DISPLAY WILL TELL THE PLAYER WHAT THE TECH DOES.
        clone.addEventListener( "mouseover", function( e ) {
            let attachTo    = document.getElementById( "mainGame" );
            let panelWidth  = document.getElementById( "upgradeScreen" ).getBoundingClientRect( ).width;
            let cmdPanelWid = document.getElementById( "commandPanel" ).getBoundingClientRect( ).width;
            let bodyWidth   = document.body.clientWidth;

            //CLONE TEMP TECH DESCRIPTION BOX
            let techBoxClone = document.getElementById( "tempTechDescBox" ).cloneNode( true );
            let techDescBox = techBoxClone.children[0];
            let techTipBox  = techBoxClone.children[1];


            //ASSIGN CLONES WITH NEW INFORMATION
            let techData    = PooClickerData.getTechById( ( e.srcElement.id ).replace( "tech", "" ) );

                techBoxClone.id                   = "clone";
                techDescBox.children[0].innerHTML = techData["title"];
                techDescBox.children[1].innerHTML = techData["effect"];

                techTipBox.children[0].innerHTML  = techData["desc"];


                //NEED TO KNOW IF THIS IS PURCHASEABLE
                if( SessionState.getTotalPoo( ) > techData["cost"] ) {
                    techTipBox.children[1].innerHTML  = "Cost: " + 
                    "<span class='purchaseable'>" + SessionState.getDisplayNotation( techData["cost"] ) + "</span>" + " poo";
                }

                else {
                    techTipBox.children[1].innerHTML  = "Cost: " + 
                    "<span class='notPurchaseable'>" + SessionState.getDisplayNotation( techData["cost"] ) + "</span>" + " poo";
                }

            //ASSIGN CLONES WITH NEW POSITION
                techBoxClone.style.display = "block";
                techBoxClone.style.left    = bodyWidth - panelWidth - cmdPanelWid - 360;
                techBoxClone.style.top     = e.y - 45;

                //TOP MIGHT REQUIRE EXTRA ATTENTION BECAUSE THE ICON COULD BE SOMEWHERE REALLY LOW.
            attachTo.appendChild( techBoxClone );
        });

        clone.addEventListener( "mouseout", function( ) {
            let attachFrom   = document.getElementById( "mainGame" );
            let techBoxClone = document.getElementById( "clone" );

            attachFrom.removeChild( techBoxClone );
        });

        //ADD THEM TO THE TECH TREE CONTAINER.
        techTreeContainer.appendChild( clone );
    });	
}


//=================================================================
// UI DYNAMIC GENERATION 
//=================================================================
function generateAchievementIcon( ) {
    let chevoEarnedBox = document.getElementById( "achievementTab" );	//attachTo
    let allChevoKeys   = SessionState.getAchievementKeys( );			//[1][2][3]
    
    //RESET ACHIEVEMENT DISPLAY CASE
    chevoEarnedBox.innerHTML = "";	

    //UPDATE EVERY ICON ON THE LIST TO MAKE SURE NOTHING IS MISSING
    allChevoKeys.forEach( function( keys ) {
        let isNotLocked = SessionState.getAchievementById( keys );	//ONLY ADD THE ONE IS UNLOCKED									
        let chevoData   = PooClickerData.getAchievementById( keys );

        if( isNotLocked ) {
            //CLONE THE TECH ICON AS ACHIEVEMENT ICON
            let chevoDisplayClone = document.getElementById( "tempTechIcon" ).cloneNode( true );
                chevoDisplayClone.style.backgroundImage = "url('img/" + chevoData["sprite"] + "')";
                chevoDisplayClone.style.display         = "block";

            //ADD MOUSEOVER EVENT TO POP UP ACHIEVEMENT DETAILS
            chevoDisplayClone.addEventListener( "mouseover", function( e ) {
                //CLONE TEMP TECH DESCRIPTION BOX
                let container     = document.getElementById( "statsScreen" );		//CONTAINER FOR TIP BOX
                let chevoBoxClone = document.getElementById( "tempAchievement" ).cloneNode( true );
                let panelWidth    = document.getElementById( "upgradeScreen" ).getBoundingClientRect( ).width;

                
                let chevoBoxClose  = chevoBoxClone.children[0];                //Close Button
                let chevoBoxTitle  = chevoBoxClone.children[2].children[0];    //Chevo Title
                let chevoBoxIcon   = chevoBoxClone.children[1].children[0];    //Chevo Icon Link
                let chevoBoxDesc   = chevoBoxClone.children[2].children[1];    //Chevo Description

                //PLACEMENT OF THE CHEVO BOX
                chevoBoxClone.id                   = "chevoClone";
                chevoBoxClone.style.position       = "absolute";
                chevoBoxClone.style.display        = "block"; 
                chevoBoxClone.style.left           = e.x - 400;  //panelWidth + 10;
                chevoBoxClone.style.top            = e.y;  //e.clientY - 30;

                //ATTRIBUTES AND DETAIL OF THE CHEVO BOX
                chevoBoxClose.style.display        = "none";
                chevoBoxTitle.innerHTML            = chevoData["title"];
                chevoBoxIcon.style.backgroundImage = "url('img/" + chevoData["sprite"] + "')";
                chevoBoxDesc.innerHTML             = chevoData["desc"];

                container.appendChild( chevoBoxClone );
            });

            chevoDisplayClone.addEventListener( "mouseout", function( e ) {
                let clone = document.getElementById( "chevoClone" );
                ( clone.parentNode ).removeChild( clone );
            });

            chevoEarnedBox.appendChild( chevoDisplayClone );
        }
    });
}