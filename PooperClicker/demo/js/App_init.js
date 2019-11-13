/*\
|*| =======================================================
|*|  GAME INITIALIZATION
|*| =======================================================
\*/
function initPooStoreContorl( ) {
    let buyBtn            = document.getElementById( "buyBtn" );
    let sellBtn			  = document.getElementById( "sellBtn" );
    let _1xBtn 		      = document.getElementById( "1x" );
    let _10xBtn           = document.getElementById( "10x" );
    let _100xBtn          = document.getElementById( "100x" );

    //UPGRADE -> QUANTITY CONTROLS
    buyBtn.addEventListener(  "click", buyBtnPress );
    sellBtn.addEventListener(  "click", sellBtnPress );
    _1xBtn.addEventListener(  "click", quantityOne );	
    _10xBtn.addEventListener( "click", quantityTen );
    _100xBtn.addEventListener( "click", quantityHundred );

    // =========================================
    //  PANEL -> POO STORE -> QUANTITY CONTROLS
    // =========================================
    function buyBtnPress( e ) {
        sellBtn.className = "optionBtn";
        buyBtn.className  = "optionBtn active";
        SessionState.buyOrSellToggle( true );
        updateQuantityCost( );
    }
    
    function sellBtnPress( e ) {
        buyBtn.className  = "optionBtn";
        sellBtn.className = "optionBtn active";
        SessionState.buyOrSellToggle( false );
        updateQuantityCost( );
    }

    function quantityOne( e ) {
        removeAllActiveQuantity( );
        e.srcElement.className = e.srcElement.className + " active";
        SessionState.setBuyOrSellQuantity( 1 );
        updateQuantityCost( );
    }

    function quantityTen( e ) {
        removeAllActiveQuantity( );
        e.srcElement.className = e.srcElement.className + " active";
        SessionState.setBuyOrSellQuantity( 10 );
        updateQuantityCost( );
    }

    function quantityHundred( e ) {
        removeAllActiveQuantity( );
        e.srcElement.className = e.srcElement.className + " active";
        SessionState.setBuyOrSellQuantity( 100 );
        updateQuantityCost( );
    }

    //Utility Function
    function removeAllActiveQuantity( ) {
        PooClickerData.getQuantity( ).forEach( function(element) {
            let quantity = document.getElementById( element );
            quantity.className = "quantityBtn";
        });
    }

    function updateQuantityCost( ) {
        //=====================================================
        // GET ALL THE UPGRADABLE ELEMENTS ON THE UPGRADELIST
        //=====================================================
        let upgradeListElement = document.getElementById( "upgradeList").childNodes;

        //=====================================================
        // UPDATE ALL THE PRICES ON THE LIST - BUY
        //=====================================================
        if( SessionState.getBuyOrSell( ) ) {
            upgradeListElement.forEach( function( element ) {
                let name 		   = (element.id).replace("Upgrade", "");	//Shovel
                let curLevel       = SessionState.getLevel( name );			//Level 43
                let increment      = SessionState.getBuyOrSellQuantity( );	//1 / 10 / 100

                let costId         = name + "Cost";							//ShovelCost
                let upgradeElement = document.getElementById( costId );		//Shovel Upgrade Element

                let sum            = PooClickerData.calcSumPrice( name, curLevel, increment );
                let newCost        = SessionState.getDisplayNotation( sum );
                
                upgradeElement.innerHTML = newCost;
            });
        }

        //=====================================================
        // UPDATE ALL THE PRICES ON THE LIST - SELL
        //=====================================================
        else {
            upgradeListElement.forEach( function( element ) {
                let name 		   = (element.id).replace("Upgrade", "");	//Shovel
                let curLevel       = SessionState.getLevel( name );			//Level 43
                let decrement      = SessionState.getBuyOrSellQuantity( );	//1 / 10 / 100

                let costId         = name + "Cost";							//ShovelCost
                let upgradeElement = document.getElementById( costId );		//Shovel Upgrade Element

                let sum            = PooClickerData.calcSellPrice( name, curLevel, decrement );
                let refundAmt      = SessionState.getDisplayNotation( sum );
                
                upgradeElement.innerHTML = refundAmt;
            });
        }
    }
}

function initSettingControl( ) {
    let ngBtn             = document.getElementById( "ngBtn" );
    let saveBtn           = document.getElementById( "saveBtn" );

    saveBtn.addEventListener( "click", saveGame );		
    ngBtn.addEventListener( "click", clearGame );

    //SET ALL THE LOADING STUFF HERE
    _makeSaveDataSlot( );

    // =========================================
    //  SETTING - MAKE LOADING SLOT
    // =========================================
    function _makeSaveDataSlot( ) {
        const data      = SaveData.localStorageToSetting( );
        const container = document.getElementById( "setting-saveData" );
              container.innerHTML = "";

        data.forEach( (game) => {
            let saveTxt = `${game["WorldName"]} @ ${game["GameTime"]["seconds"]}s`;
            
            let tempDiv = document.createElement( "div" );
            let txtNode = document.createTextNode( saveTxt );
            
            //Set Class Attribute
            tempDiv.setAttribute( "class", "setting-saveBtn gData" );
            tempDiv.setAttribute( "id", game );
            
            //Dynamically create event listeners
            tempDiv.addEventListener( "click", (e) => {
                SessionState.reset( );
                SessionState.makeGame( e.srcElement.id, game );

                document.getElementById( "nameInput" ).value = SessionState.getWorldName( );	//SET WORLD NAME
                
                startGame( );
                // generateList( );				//SET UPGRADE LIST VISUAL
                // generateTechTreeIcon( ); 		//SET TECH TREE ICON VISUAL
                // updateStatistics( );			//SET STATISTICS VISUAL
                // generateAchievementIcon( );		//GENERATE ACHIEVEMENTS

                SessionState.debug( );	//DELETE ME
            });
    
            //Attach SaveSlot Element to Container
            tempDiv.appendChild( txtNode );
            container.appendChild( tempDiv );
        });
    }

    // =========================================
    //  SETTING - SAVE GAME FUNCTION
    // =========================================
    function saveGame( e ) {	
        SaveData.saveToLocalStorage( );	

        pooArea = document.getElementById( "mainScreen" );

        //Add div element with the number pop up
        //Div moves up over 1 seconds and disappears after 1 seconds
        //absolute position it.
        let tempDiv = document.createElement( "div" );
        let txtNode = document.createTextNode( "GAME SAVED!" );

        tempDiv.setAttribute( "class", "SaveMsgBox" );
        tempDiv.style.opacity = 1.0;

        tempDiv.appendChild( txtNode );
        pooArea.appendChild( tempDiv );

        let tempTimer = new StatusTimer( tempDiv );
        tempTimer.start( );


        //NEED TO UPDATE LOAD SETTING
        //SO THAT YOUR SAVE GAME WILL APPEAR RIGHT AFTER SAVING
        _makeSaveDataSlot( );
    }
}

function initPanelControl( ) {
    let upgradeClsBtn     = document.getElementById( "upgradeClsBtn" );
    let statsClsBtn       = document.getElementById( "statsClsBtn" );
    let settingClsBtn     = document.getElementById( "settingClsBtn" );

    let upgradeBtn        = document.getElementById( "upgradeBtn" );
    let statsBtn          = document.getElementById( "statsBtn" );
    let settingBtn        = document.getElementById( "settingBtn" );
    //let techBtn           = document.getElementById( "techBtn" );

    
    //PANEL CONTROLS
    upgradeClsBtn.addEventListener( "click", (e) => toggleWindow( "upgradeScreen" ) );
    statsClsBtn.addEventListener( "click", (e) => toggleWindow( "statsScreen" ) );
    settingClsBtn.addEventListener( "click", (e) => toggleWindow( "settingScreen" ) );

    upgradeBtn.addEventListener( "click", (e) => toggleWindow( "upgradeScreen" ) );
    statsBtn.addEventListener(   "click", (e) => toggleWindow( "statsScreen" ) );
    settingBtn.addEventListener( "click", (e) => toggleWindow( "settingScreen" ) );

    function toggleWindow( id ) {
        switch( id ) {
            case "upgradeScreen":
            //	techScreen.style.display    = "none";
                statsScreen.style.display   = "none";
                settingScreen.style.display = "none";

            //	techBtn.className    = "cmdBtn";
                statsBtn.className   = "cmdBtn";
                settingBtn.className = "cmdBtn";

                toggleClass( upgradeBtn, "selected" );
            break;

            case "techScreen":
                upgradeScreen.style.display = "none";
                statsScreen.style.display   = "none";
                settingScreen.style.display = "none";

                upgradeBtn.className    = "cmdBtn";
                statsBtn.className      = "cmdBtn";
                settingBtn.className    = "cmdBtn";

                toggleClass( techBtn, "selected" );
            break;

            case "statsScreen":
                upgradeScreen.style.display = "none";
            //	techScreen.style.display    = "none";
                settingScreen.style.display = "none";

                upgradeBtn.className  = "cmdBtn";
            //	techBtn.className     = "cmdBtn";
                settingBtn.className  = "cmdBtn";

                toggleClass( statsBtn, "selected" );
            break;

            case "settingScreen":
                upgradeScreen.style.display = "none";
            //	techScreen.style.display    = "none";
                statsScreen.style.display   = "none";

                upgradeBtn.className  = "cmdBtn";
            //	techBtn.className     = "cmdBtn";
                statsBtn.className    = "cmdBtn";

                toggleClass( settingBtn, "selected" );
            break;
        }
        
        let selectedScreen = document.getElementById( id );
        selectedScreen.style.display = ( selectedScreen.style.display == "block" ) ? "none" : "block";

        function toggleClass( el, className ) {
            let classList = el.className;

            if( classList.match( className ) ) {
                el.className = classList.replace(" " + className, "");
            } else {
                el.className += " " + className;
            }
        }
    }
}

function initGameControls( ) {
    let giantPoo          = document.getElementById( "pooClicker" );
    let worldNameInput    = document.getElementById( "worldNameBlock" );

    //MAIN SCREEN -> POO CONTROL & WORLD NAME CHANGE
    giantPoo.addEventListener( "mousedown", (e) => e.srcElement.className = "cursorGrabbing" );
    giantPoo.addEventListener( "mouseup", (e) => e.srcElement.className = "cursorOpen" );
    giantPoo.addEventListener( "click", poo_onClick );
    worldNameInput.addEventListener( "click", changeInputClicked );

    // =========================================
    //  MAIN SCREEN -> WORLD NAME INPUT
    // =========================================
    function changeInputClicked( e ) {
        let input = document.getElementById( "nameInput" );
            input.disabled = false;
            input.select( );

        input.addEventListener( "change", nameEntered );
    }

    function nameEntered( e ) {
        this.removeEventListener( "change", nameEntered );
        this.disabled = true;

        SessionState.setWorldName( this.value + " World" );
        this.value += " World";
    }


    // =========================================
    //  MAIN SCREEN -> GIANT POO
    // =========================================
    function poo_onClick( e ) {
        let manualPooGenerated = SessionState.calcPooPerClick( );

        var pooArea = document.getElementById( "pooArea" );

        //Add div element with the number pop up
        //Div moves up over 1 seconds and disappears after 1 seconds
        //absolute position it.
        let tempDiv = document.createElement( "div" );
        let txtNode = document.createTextNode( "+" + SessionState.getDisplayNotation( manualPooGenerated ) );

        tempDiv.setAttribute( "class", "pooClicked" );
        tempDiv.style.left = GameUtility.between(e.offsetX - 120, e.offsetX + 12) + "px";
        tempDiv.style.top  = (e.offsetY-50) + "px";
        tempDiv.style.opacity = 1.0;

        tempDiv.appendChild( txtNode );
        pooArea.appendChild( tempDiv );

        var tempTimer = new PooNumber( tempDiv );
        tempTimer.start( );

        if( hackMode ) {
            SessionState.addPoo( hackClickAmt );
            SessionState.addPooSinceStart( hackClickAmt );
            SessionState.addClick( 1 );

        } else {
            SessionState.addPoo( manualPooGenerated );
            SessionState.addPooSinceStart( manualPooGenerated );

            SessionState.addClick( 1 );
        }
    }
}

function initSessionState( ) {
    SessionState.addTimer( );                   //SET TIMER
    PooClickerData.getMessageBoardUpdate( ); 	//SET RANDOM MESSAGE BOARD
}


/*\
|*| =======================================================
|*|  FUNCTION 	devNoteControlSetup
|*|  TOGGLE DEVELOPMENT PAGE
|*| =======================================================
\*/
function devNoteControlSetup( ) {
    document.getElementById( "devNoteToggle" ).addEventListener( "click", function( ) {
        document.getElementById( "devNote" ).style.display = "block";
    });

    document.getElementById( "closeDevNote" ).addEventListener( "click", function( ) {
        var devNote = document.getElementById( "devNote" );

        devNote.scrollTop = 0;
        devNote.style.display = "none";
    });
}


/*\
|*| =======================================================
|*|  FUNCTION 	startGame
|*|  Initial Game Setup - Before game can start
|*| =======================================================
\*/
function startGame( ) {
    SessionState.getTimer( ).start( );	//START GAME TIMER

    document.getElementById( "nameInput" ).value = SessionState.getWorldName( );	//SET WORLD NAME

    messageTimer = setInterval( ( ) => {
        let messageBoard = document.getElementById( "randomMessage" );
            messageBoard.className = "";
            messageBoard.className = "randomMessage";
            messageBoard.innerHTML = SessionState.getRandomMessage( );
    }, 12500 );

    //Initial Update => Upgrade | Tech | Achievement | Statistics
    generateList( );				//SET UPGRADE LIST VISUAL
    generateTechTreeIcon( ); 		//SET TECH TREE ICON VISUAL
    updateStatistics( );			//SET STATISTICS VISUAL
    generateAchievementIcon( );		//GENERATE ACHIEVEMENTS
}


/*\
|*| =======================================================
|*|  FUNCTION 	clearGame
|*|  Clear Game Setup - Before Starting the next game
|*| =======================================================
\*/
function clearGame( ) {
    clearInterval( messageTimer );  //CLEAR RANDOM MESSAGE
    clearInterval( updateTimer );   //CLEAR GAME LOOP

    messageTimer = null;
    updateTimer = null;

    SessionState.reset( );

    resetWorldMsg( );               //RESET WORLD MESSAGE
    resetAllPanels( );              //UPGRADE LIST | TECH TREE | ACHIEVEMENTS
    resetStatistic( );              //CLEAR ALL STATISTICS
    resetQuantity( );               //RESET ALL QUANTITY

    initSessionState( );            //SET SESSION STATE

    enterGameLoop( );

    function resetWorldMsg( ) {
        //CLEAR WORLD MESSAGE   
        let x = document.getElementById( "randomMessage" );
            x.className = "";
            x.className = "staticMessage";
            x.innerHTML = "There is a piece of poo laying around on our beautiful planes..."
    }
    
    function resetAllPanels( ) {
        document.getElementById( "upgradeList" ).innerHTML    = "";     //CLEAR UPGRADE LIST
        document.getElementById( "techList" ).innerHTML       = "";     //CLEAR TECH TREE LIST
        document.getElementById( "achievementTab" ).innerHTML = "";     //CLEAR ACHIEVEMENTS
    }
    
    function resetStatistic() {
        document.getElementById("currentTime").innerHTML = "0";
        document.getElementById("totalPooCollected").innerHTML = "0";
        document.getElementById("totalClicksMade").innerHTML = "0";
        document.getElementById("totalPooSinceStart").innerHTML = "0";
        document.getElementById("totalUpgrades").innerHTML = "0";
    
        document.getElementById("ppsDisplay").innerHTML = "per second: 0";  //RESET POO PER SECONDS
        document.getElementById("totalPooDisplay").innerHTML = "0 POOPS";   //RESET POO COUNT
        document.getElementById("nameInput").value = "Poopy World";         //RESET WORLD NAME
    }
    
    //=================================================================
    // RESET CONTROL - UTILITY METHODS
    //=================================================================
    function resetQuantity( ) {
        PooClickerData.getQuantity( ).forEach( function( element ) {
            document.getElementById( element ).className = "quantityBtn";
        });
    
        document.getElementById( "1x" ).className      = "quantityBtn active";
        document.getElementById( "buyBtn" ).className  = "optionBtn active";
        document.getElementById( "sellBtn" ).className = "optionBtn";
    }

    SessionState.debug( );
}




