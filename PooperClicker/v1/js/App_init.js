// =======================================================
//  GAME INITIALIZATION
// =======================================================
function initPooStoreContorl( ) {
    let buyBtn            = $D.id( "buyBtn" );
    let sellBtn			  = $D.id( "sellBtn" );
    let _1xBtn 		      = $D.id( "1x" );
    let _10xBtn           = $D.id( "10x" );
    let _100xBtn          = $D.id( "100x" );

    //UPGRADE -> QUANTITY CONTROLS
    buyBtn.addEventListener(  "click", buyBtnPress );
    sellBtn.addEventListener(  "click", sellBtnPress );
    _1xBtn.addEventListener(   "click", ( e ) => quantity( e, 1 ) );	
    _10xBtn.addEventListener(  "click", ( e ) => quantity( e, 10 ) );
    _100xBtn.addEventListener( "click", ( e ) => quantity( e, 100 ) );

    // =========================================
    //  PANEL -> POO STORE -> QUANTITY CONTROLS
    // =========================================
    function buyBtnPress( e ) {
        sellBtn.className = "optionBtn";
        buyBtn.className  = "optionBtn active";
        $ST.buyOrSellToggle( true );
        updateQuantityCost( );
    }
    
    function sellBtnPress( e ) {
        buyBtn.className  = "optionBtn";
        sellBtn.className = "optionBtn active";
        $ST.buyOrSellToggle( false );
        updateQuantityCost( );
    }

    function quantity( e, quantity ) {
        removeAllActiveQuantity( );
        e.srcElement.className = e.srcElement.className + " active";
        $ST.setBuyOrSellQuantity( quantity );
        updateQuantityCost( );
    }

    //Utility Function
    function removeAllActiveQuantity( ) {
        PooClickerData.getQuantity( ).forEach( function(element) {
            $D.id( element ).className = "quantityBtn";
        });
    }

    function updateQuantityCost( ) {
        //=====================================================
        // GET ALL THE UPGRADABLE ELEMENTS ON THE UPGRADELIST
        //=====================================================
        let upgradeListElement = $D.id( "upgradeList").childNodes;

        //=====================================================
        // UPDATE ALL THE PRICES ON THE LIST - BUY
        //=====================================================
        if( $ST.getBuyOrSell( ) ) {
            upgradeListElement.forEach( function( element ) {
                let name 		   = (element.id).replace("Upgrade", "");	//Shovel
                let curLevel       = $ST.getLevel( name );			//Level 43
                let increment      = $ST.getBuyOrSellQuantity( );	//1 / 10 / 100

                let costId         = name + "Cost";							//ShovelCost
                let upgradeElement = $D.id( costId );		//Shovel Upgrade Element

                let sum            = PooClickerData.calcSumPrice( name, curLevel, increment );
                let newCost        = $ST.getDisplayNotation( sum );
                
                upgradeElement.innerHTML = newCost;
            });
        }

        //=====================================================
        // UPDATE ALL THE PRICES ON THE LIST - SELL
        //=====================================================
        else {
            upgradeListElement.forEach( function( element ) {
                let name 		   = (element.id).replace("Upgrade", "");	//Shovel
                let curLevel       = $ST.getLevel( name );			//Level 43
                let decrement      = $ST.getBuyOrSellQuantity( );	//1 / 10 / 100

                let costId         = name + "Cost";							//ShovelCost
                let upgradeElement = $D.id( costId );		//Shovel Upgrade Element

                let sum            = PooClickerData.calcSellPrice( name, curLevel, decrement );
                let refundAmt      = $ST.getDisplayNotation( sum );
                
                upgradeElement.innerHTML = refundAmt;
            });
        }
    }
}

function initSettingControl( ) {
    let ngBtn   = $D.id( "ngBtn" );
    let saveBtn = $D.id( "saveBtn" );

    saveBtn.addEventListener( "click", saveGame );		
    ngBtn.addEventListener( "click", ng );

    //SET ALL THE LOADING STUFF HERE
    _makeSaveDataSlot( );

    // =========================================
    //  SETTING - MAKE LOADING SLOT
    // =========================================
    function _makeSaveDataSlot( ) {
        const data      = SaveData.localStorageToSetting( );
        const container = $D.id( "setting-saveData" );
              container.innerHTML = "";

        data.forEach( (game) => {
            let saveTxt = `${game[1]["WorldName"]} @ ${game[1]["Time"]["sessionRunTime"]}s`;

            let tempDiv = document.createElement( "div" );
            let txtNode = document.createTextNode( saveTxt );
            
            //Set Class Attribute
            tempDiv.setAttribute( "class", "setting-saveBtn gData" );
            tempDiv.setAttribute( "id", game[0] );

            //Dynamically create event listeners
            tempDiv.addEventListener( "click", (e) => {
                ng( e.srcElement.id, game[1] );
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

        pooArea = $D.id( "mainScreen" );

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


    // =======================================================
    //  FUNCTION 	clearGame
    //  Clear Game Setup - Before Starting the next game
    // =======================================================
    function ng( slotID, data ) {
        clearInterval( updateTimer );   //CLEAR GAME LOOP
        updateTimer = null;

        $ST.reset( );

        if( slotID && data ) {
            $ST.makeGame( slotID, data );
        }

        resetWorldMsg( );               //RESET WORLD MESSAGE
        resetAllPanels( );              //UPGRADE LIST | TECH TREE | ACHIEVEMENTS
        resetStatistic( );              //CLEAR ALL STATISTICS
        resetQuantity( );               //RESET ALL QUANTITY

        initSessionState( );            //SET SESSION STATE  

        enterGame( );

        function resetWorldMsg( ) {
            //CLEAR WORLD MESSAGE   
            let x = $D.id( "randomMessage" );
                x.className = "";
                x.className = "staticMessage";
                x.innerHTML = "There is a piece of poo laying around on our beautiful planes..."
        }
        
        function resetAllPanels( ) {
            $D.id( "upgradeList" ).innerHTML    = "";     //CLEAR UPGRADE LIST
            $D.id( "techList" ).innerHTML       = "";     //CLEAR TECH TREE LIST
            $D.id( "achievementTab" ).innerHTML = "";     //CLEAR ACHIEVEMENTS
        }
        
        function resetStatistic() {
            $D.id("currentTime").innerHTML = "0";
            $D.id("totalPooCollected").innerHTML = "0";
            $D.id("totalClicksMade").innerHTML = "0";
            $D.id("totalPooSinceStart").innerHTML = "0";
            $D.id("totalUpgrades").innerHTML = "0";
        
            $D.id("ppsDisplay").innerHTML = "per second: 0";  //RESET POO PER SECONDS
            $D.id("totalPooDisplay").innerHTML = "0 POOPS";   //RESET POO COUNT
            $D.id("nameInput").value = "Poopy World";         //RESET WORLD NAME
        }
        
        //=================================================================
        // RESET CONTROL - UTILITY METHODS
        //=================================================================
        function resetQuantity( ) {
            PooClickerData.getQuantity( ).forEach( function( element ) {
                $D.id( element ).className = "quantityBtn";
            });
        
            $D.id( "1x" ).className      = "quantityBtn active";
            $D.id( "buyBtn" ).className  = "optionBtn active";
            $D.id( "sellBtn" ).className = "optionBtn";
        }
    }
}

function initPanelControl( ) {
    let upgradeClsBtn     = $D.id( "upgradeClsBtn" );
    let statsClsBtn       = $D.id( "statsClsBtn" );
    let settingClsBtn     = $D.id( "settingClsBtn" );

    let upgradeBtn        = $D.id( "upgradeBtn" );
    let statsBtn          = $D.id( "statsBtn" );
    let settingBtn        = $D.id( "settingBtn" );
    //let techBtn           = $D.id( "techBtn" );

    
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
        
        let selectedScreen = $D.id( id );
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
    let giantPoo          = $D.id( "pooClicker" );
    let worldNameInput    = $D.id( "worldNameBlock" );

    //MAIN SCREEN -> POO CONTROL & WORLD NAME CHANGE
    giantPoo.addEventListener( "mousedown", (e) => e.srcElement.className = "cursorGrabbing" );
    giantPoo.addEventListener( "mouseup", (e) => e.srcElement.className = "cursorOpen" );
    giantPoo.addEventListener( "click", poo_onClick );
    worldNameInput.addEventListener( "click", changeInputClicked );

    // =========================================
    //  MAIN SCREEN -> WORLD NAME INPUT
    // =========================================
    function changeInputClicked( e ) {
        let input = $D.id( "nameInput" );
            input.disabled = false;
            input.select( );

        input.addEventListener( "change", nameEntered );
    }

    function nameEntered( e ) {
        this.removeEventListener( "change", nameEntered );
        this.disabled = true;

        $ST.setWorldName( this.value + " World" );
        this.value += " World";
    }


    // =========================================
    //  MAIN SCREEN -> GIANT POO
    // =========================================
    function poo_onClick( e ) {
        let manualPooGenerated = hackMode ? hackClickAmt : calcPooPerClick( );

        //Pop up number after clicking
        //disappears after 1 seconds
        createPooNumber( );

        if( hackMode ) {
            $ST.addPoo( hackClickAmt );
            $ST.addPooSinceStart( hackClickAmt );
            $ST.addClick( 1 );

        } else {
            $ST.addPoo( manualPooGenerated );
            $ST.addPooSinceStart( manualPooGenerated );

            $ST.addClick( 1 );
        }


        function createPooNumber( ) {
            let pooArea = $D.id( "pooArea" );

            let tempDiv = document.createElement( "div" );
            let txtNode = document.createTextNode( "+" + $ST.getDisplayNotation( manualPooGenerated ) );

            tempDiv.setAttribute( "class", "pooClicked" );
            tempDiv.style.left = GameUtility.between(-85, 120) + "px";
            tempDiv.style.top  = (e.offsetY-50) + "px";
            tempDiv.style.opacity = 1.0;

            tempDiv.appendChild( txtNode );
            pooArea.appendChild( tempDiv );

            let tempTimer = new PooNumber( tempDiv );
            tempTimer.start( );
        }

        function calcPooPerClick( ) {
            return ( 1 + $ST.getLevel( "Hand" ) ) * ( 1 + $ST.getMultiplierByName( "Hand" ) );
        }
    }
}

function initSessionState( ) {
    PooClickerData.getMessageBoardUpdate( ); 	//SET RANDOM MESSAGE BOARD ID 1 & 2
}



// =======================================================
//  FUNCTION 	devNoteControlSetup
//  TOGGLE DEVELOPMENT PAGE
// =======================================================
function devNoteControlSetup( ) {
    $D.id( "devNoteToggle" ).addEventListener( "click", function( ) {
        $D.id( "devNote" ).style.display = "block";
    });

    $D.id( "closeDevNote" ).addEventListener( "click", function( ) {
        let devNote = $D.id( "devNote" );

        devNote.scrollTop = 0;
        devNote.style.display = "none";
    });
}

function headerSetup( ) {
    const title = `POOPER CLICKER &copy ${copyright.dateTo} | ${copyright.version}`;
    $D.id( "browserTitle" ).innerHTML = title;
}