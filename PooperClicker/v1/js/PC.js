// =====================================================================
//  GAMEDATA
// 	   Hard Code Game Data for PooperClicker
// 	   Contains all the upgrades, screen activity information.
//
//  Change this section if you want the game
//  to run a little different.  This is use for
//  tweeking game mechanics and fun factor of the
//  game.
// =====================================================================

function GameData( ) {
	//=======================================================================
	// const upgrade
	//		Describes all the upgrades that is purchasable in the game.
	//
	// Factor - Percentage that price will increase with each upgrade.
	// Base   - Base price for an upgrade
	// PPS    - Poo per second that an upgrade will accumulate in levels.
	// Refund - Percentage of poo return if an upgrade were to be sold.
	//=======================================================================
	const upgrade = {
		"Hand"         : { "name" : "Hand",        "factor" : 0.25, "base" :     15,   "PPS" :   0.00,  "refund" : 0.80 },
		"Shovel"       : { "name" : "Shovel",      "factor" : 0.20, "base" :    100,   "PPS" :   0.10,	"refund" : 0.20 },
		"Baby"         : { "name" : "Baby",        "factor" : 0.20, "base" :   1200,   "PPS" :   1.00,	"refund" : 0.20 },
		"Animal Farm"  : { "name" : "Animal Farm", "factor" : 0.20, "base" :  17000,   "PPS" :   3.00,	"refund" : 0.20 },
		"Toilet"       : { "name" : "Toilet",      "factor" : 0.20, "base" :  65000,   "PPS" :  14.00,	"refund" : 0.20 }
	};


	//=======================================================================
	// UPGRADE - SEARCH METHODS
	//=======================================================================
		function getUpgradeByName( name ) { return upgrade[name]; }				//RETRIEVE ALL INFORMATION ABOUT AN UPGRADE
		function getUpgradeFactor( name ) { return upgrade[name]["factor"]; } 	//RETRIEVE AN UPGRADE'S FACTOR ONLY
		function getUpgradeBase( name )   { return upgrade[name]["base"]; }		//RETRIEVE AN UPGRADE'S BASE COST ONLY
		function getUpgradePPS( name )    { return upgrade[name]["PPS"]; }		//RETRIEVE AN UPGRADE'S PPS ONLY
		function getUpgradeRefund( name ) { return upgrade[name]["refund"]; }	//RETRIEVE AN UPGRADE'S REFUND PERCENTAGE ONLY
		function getAllUpgradeName( )     { return Object.keys( upgrade );	}


		//===================================================================
		// selectAllUpgradeByProperty
		// 	SPECIFICALLY PICK PROPERTIES FROM GAME DATA
		//===================================================================
		function selectAllUpgradeByProperty( ...prop ) {
			let record = {};

			getAllUpgradeName( ).forEach( (element) => {
				record[element] = {};

				prop.forEach( (_p) => {
					record[element][_p] = upgrade[element][_p];
				});
			});

			return record;
		}


	//=======================================================================
	// UPGRADE - CALCULATION METHODS
	//=======================================================================
		//===================================================================
		// Method		: calcPrice( name, level )
		// Description : Calculate the current price of a particular upgrade
		//				  based on the level that the player currently 
		//				  accumulated.
		//
		// Parameters  :
		// 	@name 	: Upgrade Name [Shovel, Baby, Animal Farm ...]
		//	    @level  : Current level of the upgrade from SessionState
		//===================================================================
 
		function calcPrice( name, level ) {
			return Math.round( Math.pow( 1 + getUpgradeFactor(name), level ) * getUpgradeBase(name) );
		}

		//===================================================================
		// Method		: calcAllPPS( sessionStateUpgradeList )
		// Description : Calculate [Poop Per Second] based on accumulative
		//				  upgrade purchased inside $ST.
		//
		// Parameters  :
		// 	@sessionStateUpgradeList : SessionState upgradeList {Obj}
		//===================================================================
		function calcAllPPS( sessionStateUpgradeList ) {
			let totalPPS = 0.0;

			for( key in sessionStateUpgradeList ) {
				const upgradeKey = sessionStateUpgradeList[key];

				totalPPS += ( upgradeKey["level"] * getUpgradePPS( key ) ) * ( 1 + upgradeKey["multiplier"] );
			}
			
			return totalPPS;
		}

		//===================================================================
		// Method		: calcSumPrice( name, curLevel, increment )
		// Description : Calculate the total purchase cost for an upgrade.
		//				  This method can also calculate the sum of multi-level
		//				  upgrade. For example: Purchase 10x of Shovel
		//
		// Parameters  :
		// 	@name   	: Upgrade name [Shovel, Baby, Animal Farm...]
		//		@curLevel	: The current level of an upgrade based on
		//					  SessionState
		// 	@increment	: How many level increase will it be.
		//===================================================================
		function calcSumPrice( name, curLevel, increment ) {
			let sum = 0;

			for( let i = 0; i < increment; i++ ) {
				sum += calcPrice( name, curLevel + i );
			}
			
			return sum;
		}

		//===================================================================
		// Method		: calcSellPrice( name, curLevel, decrement )
		// Description : Calculate the total refund of an upgrade.
		//			      This method can also refund the sum of multi-level
		//				  upgrade.  For example: Sell 10x of Shovel
		//
		// Parameters  :
		// 	@name   	: Upgrade name [Shovel, Baby, Animal Farm...]
		//		@curLevel	: The current level of an upgrade based on
		//					  SessionState
		// 	@increment	: How many level decrease will it be.
		//===================================================================
 
		function calcSellPrice( name, curLevel, decrement ) {
			let sum = 0;

			//========================================================
			// IF REQUESTED SELL AMOUNT IS LARGER THAN CURRENT LEVEL
			// THEN USE CURRENT LEVEL AND SELL EVERYTHING
			//========================================================
			if( decrement > curLevel ) {
				for( let i = 1; i <= curLevel; i++ ) {
					sum += calcPrice( name, i ) * getUpgradeRefund( name );
				}
			} 

			//============================================================
			// OTHERWISE SELL QUANTITY BASED ON SELECTION 1x | 10x | 100x
			//============================================================
			else {
				for( let i = 0; i < decrement; i++ ) {
					sum += calcPrice( name, curLevel - i ) * getUpgradeRefund( name );
				}
			}

			return Math.round( sum );
		}




	//==============================================================================
	// const upgradeTabs
	//		A structural way of organizing the panels within the game without
	//		the need to use DOM to track all my panels in the game.
	//
	//		Data Type: 		Array
	//		Value: 			[Element ID]
	// 		upgradeTab 		- Tab that contains all the upgrades - Shovel - Baby - etc
	// 		techTab    		- Not implemented yet will contain tech tree to enhance game experience.
	// 		statisticTab    - Hows all the fun facts about your current run of the game.
	// 		aboutchievementTab  - Not implemented yet.
	//==============================================================================
	const upgradeTabs = ["upgradeTab", "techTab", "statisticTab", "achievementTab"];

	function getUpgradeTabs( ) { return upgradeTabs; }


	//==============================================================================
	// const quantity
	//		Controls the the quantity of upgrade that a player can purchase.
	//		There is an option to sell the upgrade as well.
	//		1x (Default) | 10x | 100x
	//
	//		Data Type: 	Array
	//		Values: 	[Element ID]
	//==============================================================================	
	const quantity    = ["1x", "10x", "100x"];

	function getQuantity( ) { return quantity; }


	//==============================================================================
	// const techTree
	//		Holds all the tech upgrades for each upgrade.
	//
	//		Data Type: 	Object
	//		Values: 	Upgrade Object
	//
	//		require 	Required level to unlock
	//		multiplier  Poo Per SEcond Multiplier
	//		change SessionState LOAD/RESET/HeroState
	//==============================================================================	
	const techTree = {
		1 : { "owner" : "Hand",			"title" : "Handy Handy",			"desc" : "- Clean them poo up with both your hands and twice as fast please. -",																		"effect" : "Hand Multiplier +1.0",			"multiplier" :   1.00,		"cost" : 1500,					"sprite" : "handTech1.png",			"require" : { "Hand" : 10  } },
		2 : { "owner" : "Hand",			"title" : "All Hands on Deck",		"desc" : "- Embracing your destiny from here on out as professional janitor.  Better get ready. -",														"effect" : "Hand Multiplier +1.0",			"multiplier" :   1.00,		"cost" : 5000,					"sprite" : "handTech2.png",			"require" : { "Hand" : 20  } },
		3 : { "owner" : "Hand",			"title" : "Dabby Hand",				"desc" : "- You're the only expert on this land, better be proud. -",																					"effect" : "Hand Multiplier +1.0",			"multiplier" :   1.00,		"cost" : 2.500e4,				"sprite" : "handTech3.png",			"require" : { "Hand" : 30  } },
		4 : { "owner" : "Hand",			"title" : "Gimme a Hand",			"desc" : "- Pleading for help cleaning up other people's poo? Not many people will say yes, but a man gotta try. -",									"effect" : "Hand Multiplier +1.0",			"multiplier" :   1.00,		"cost" : 2.000e5,				"sprite" : "handTech4.png",			"require" : { "Hand" : 40  } },
		5 : { "owner" : "Hand",			"title" : "It Goes Hand to Hand",	"desc" : "- Are you having fun playing with this?  Please say you are, I worked very hard to get this far. -",											"effect" : "Hand Multiplier +2.0",			"multiplier" :   2.00,		"cost" : 1.400e6,				"sprite" : "handTech5.png",			"require" : { "Hand" : 50  } },
		6 : { "owner" : "Hand",			"title" : "Common Hand",			"desc" : "- You have inspired others around you and rewarded you with an identical hand to help pick up more poo, but they won't come help -",			"effect" : "Hand Multiplier +100.0",		"multiplier" : 100.00,		"cost" : 5.000e6,				"sprite" : "handTech6.png",			"require" : { "Hand" : 51  } },
		7 : { "owner" : "Hand",			"title" : "A Helping Hand",			"desc" : "- Some compliments came through that says \"you are doing a great job\" althought you knew it was poo. -",									"effect" : "Hand Multiplier +2.0",			"multiplier" :   2.00,		"cost" : 2.000e7,				"sprite" : "handTech7.png",			"require" : { "Hand" : 60  } },
		8 : { "owner" : "Hand",			"title" : "A Guiding Hand",			"desc" : "- Fellow animals walked by and you saw it as a sign of guidance but it turned out you are lead to poo. -",									"effect" : "Hand Multiplier +2.0",			"multiplier" :   2.00,		"cost" : 2.100e8,				"sprite" : "handTech8.png",			"require" : { "Hand" : 70  } },
		9 : { "owner" : "Hand",			"title" : "The Upper Hand",			"desc" : "- You're finally catching on... You did right?  All these messages isn't as random as you think. -",											"effect" : "Hand Multiplier +2.0",			"multiplier" :   2.00,		"cost" : 1.300e9,				"sprite" : "handTech9.png",			"require" : { "Hand" : 80  } },
	   10 : { "owner" : "Hand",			"title" : "Get those Hand Dirty",	"desc" : "- Trying to figure out what these messages mean?  You're gonna have to get your hands dirty because that's a lot of poos to dig up. -",		"effect" : "Hand Multiplier +3.0",			"multiplier" :   3.00,		"cost" : 1.200e10,				"sprite" : "handTech10.png",		"require" : { "Hand" : 90  } },
	   11 : { "owner" : "Hand",			"title" : "The Holding of Hand",	"desc" : "- New martial art technique to help you pick up poo faster, it turns out that you smoosh them in your hand and poo multiplies. -",			"effect" : "Hand Multiplier +3.0",			"multiplier" :   3.00,		"cost" : 2.000e11,				"sprite" : "handTech11.png",		"require" : { "Hand" : 100 } },


	   12 : { "owner" : "Shovel",		"title" : "A Wooden Shovel",		"desc" : "- Not much of a shovel.  Just a piece of wood so you don't have to use your hands. -",														"effect" : "Shovel Multiplier +1.0",		"multiplier" :   1.00,		"cost" : 1500,					"sprite" : "shovelTech1.png",		"require" : { "Shovel" : 10  } },
	   13 : { "owner" : "Shovel",		"title" : "A Garden Shovel",		"desc" : "- Improvement from the wooden shovel.  It doesn't make a mess on you. -",																		"effect" : "Shovel Multiplier +1.0",		"multiplier" :   1.00,		"cost" : 9500,					"sprite" : "shovelTech2.png",		"require" : { "Shovel" : 20  } },
	   14 : { "owner" : "Shovel",		"title" : "Scoop Shovel",			"desc" : "- That's a load of poo you're going to shovel with that... -",																				"effect" : "Shovel Multiplier +1.0",		"multiplier" :   1.00,		"cost" : 5.900e4,				"sprite" : "shovelTech3.png",		"require" : { "Shovel" : 30  } },
	   15 : { "owner" : "Shovel",		"title" : "MultiGrip Shovel",		"desc" : "- Sturdier handing, solid steel head, flexible handling, and state of the art all wheel drive.  Can't go wrong with that. -",					"effect" : "Shovel Multiplier +1.0",		"multiplier" :   1.00,		"cost" : 3.650e5,				"sprite" : "shovelTech4.png",		"require" : { "Shovel" : 40  } },
	   16 : { "owner" : "Shovel",		"title" : "Trench Shovel",			"desc" : "- Poo had became so popular that fights break out in neighborhoods and nations is discussing how to secure this precious resources. -",		"effect" : "Shovel Multiplier +2.0",		"multiplier" :   2.00,		"cost" : 2.260e6,				"sprite" : "shovelTech5.png",		"require" : { "Shovel" : 50  } },
	   17 : { "owner" : "Shovel",		"title" : "Power Shovel",			"desc" : "- Business recongized the necessity of owning a shovel, a shovel that can dig 10 feet deep. - ",												"effect" : "Shovel Multiplier +100.0",		"multiplier" : 100.00,		"cost" : 2.710e6,				"sprite" : "shovelTech6.png",		"require" : { "Shovel" : 51  } },
	   18 : { "owner" : "Shovel",		"title" : "Flat Head Shovel",		"desc" : "- We don&apos;t want the poo to be deformed when you scoop them up, gently lay them on your shovel flat. -",									"effect" : "Shovel Multiplier +2.0",		"multiplier" :   2.00,		"cost" : 1.400e7,				"sprite" : "shovelTech7.png",		"require" : { "Shovel" : 60  } },
	   19 : { "owner" : "Shovel",		"title" : "Edging Shovel",			"desc" : "- Gradually chipping off the lands for poo. -",																								"effect" : "Shovel Multiplier +2.0",		"multiplier" :   2.00,		"cost" : 8.600e7,				"sprite" : "shovelTech8.png",		"require" : { "Shovel" : 70  } },
	   20 : { "owner" : "Shovel",		"title" : "Square Head Shovel",		"desc" : "- Shovel come in all shape and size.  Size is the most important part. Ka! Ching! -",															"effect" : "Shovel Multiplier +2.0",		"multiplier" :   2.00,		"cost" : 5.370e8,				"sprite" : "shovelTech9.png",		"require" : { "Shovel" : 80  } },
	   21 : { "owner" : "Shovel",		"title" : "Pointy Shovel",			"desc" : "- School demanded shovels that is children friendly with speed and hostility. -",																"effect" : "Shovel Multiplier +3.0",		"multiplier" :   3.00,		"cost" : 3.300e9,				"sprite" : "shovelTech10.png",		"require" : { "Shovel" : 90  } },
	   22 : { "owner" : "Shovel",		"title" : "Round Shovel",			"desc" : "- Not practical for use on land, but who said anything about digging the land?  We can find poos in waters too... -",							"effect" : "Shovel Multiplier +3.0",		"multiplier" :   3.00,		"cost" : 2.000e10,				"sprite" : "shovelTech11.png",		"require" : { "Shovel" : 100 } },


	   23 : { "owner" : "Baby",			"title" : "Yea Baby!",				"desc" : "- Automatic 'Poo' Generator every minute of the day. Can't wait for them to grow up. -",														"effect" : "Baby Multiplier +1.0", 			"multiplier" :   1.00, 		"cost" : 1.800e4, 				"sprite" : "babyTech1.png", 		"require" : { "Baby" : 10  } },
	   24 : { "owner" : "Baby", 		"title" : "Eat Baby~~", 			"desc" : "- Got the baby to eat the veges, and the clean up is twices as bad. -", 																		"effect" : "Baby Multiplier +1.0", 			"multiplier" :   1.00, 		"cost" : 1.140e5, 				"sprite" : "babyTech2.png", 		"require" : { "Baby" : 20  } },
	   25 : { "owner" : "Baby", 		"title" : "Potty Pooper", 			"desc" : "- The babies is starting to have intelligence of their own, disturbing you every minute of the day. But we still love them. -",				"effect" : "Baby Multiplier +1.0", 			"multiplier" :   1.00, 		"cost" : 7.080e5, 				"sprite" : "babyTech3.png", 		"require" : { "Baby" : 30  } },
	   26 : { "owner" : "Baby", 		"title" : "Meconium", 				"desc" : "- This is not what anyone would expect, but do expect them, is part of the job. -",															"effect" : "Baby Multiplier +1.0", 			"multiplier" :   1.00, 		"cost" : 4.400e6, 				"sprite" : "babyTech4.png", 		"require" : { "Baby" : 40  } },
	   27 : { "owner" : "Baby", 		"title" : "Poopy Bottle", 			"desc" : "- Perfect tool to feed the baby, it reminds the parent that they are working for poo. -",														"effect" : "Baby Multiplier +2.0", 			"multiplier" :   2.00, 		"cost" : 2.720e7, 				"sprite" : "babyTech5.png", 		"require" : { "Baby" : 50  } },
	   28 : { "owner" : "Baby", 		"title" : "Formula One", 			"desc" : "- Want the highest dosage of poo production? Feed them the Formula One baby powder, 0 - 60 in 1.42 seconds. -",								"effect" : "Baby Multiplier +100.0", 		"multiplier" : 100.00, 		"cost" : 3.250e7, 				"sprite" : "babyTech6.png", 		"require" : { "Baby" : 51  } },
	   29 : { "owner" : "Baby", 		"title" : "XL Diapers", 			"desc" : "- Every household wish they can use this on their baby. -",																					"effect" : "Baby Multiplier +2.0", 			"multiplier" :   2.00, 		"cost" : 1.700e8, 				"sprite" : "babyTech7.png", 		"require" : { "Baby" : 60  } },
	   30 : { "owner" : "Baby", 		"title" : "Vitamine ABC", 			"desc" : "- Start them young and get them on the habit of eating lots and lots of protein, is for the future. -",										"effect" : "Baby Multiplier +2.0", 			"multiplier" :   2.00, 		"cost" : 1.050e9, 				"sprite" : "babyTech8.png", 		"require" : { "Baby" : 70  } },
	   31 : { "owner" : "Baby", 		"title" : "Baby Proteins", 			"desc" : "- A healthy diet is everything for the baby, especially if you want the poo. -",																"effect" : "Baby Multiplier +2.0", 			"multiplier" :   2.00, 		"cost" : 6.450e9, 				"sprite" : "babyTech9.png", 		"require" : { "Baby" : 80  } },
	   32 : { "owner" : "Baby", 		"title" : "Potty Training", 		"desc" : "- Baby poo 13 times a day, if we help them work those muscles we can bump that up to 33 times a day. -",										"effect" : "Baby Multiplier +3.0", 			"multiplier" :   3.00, 		"cost" : 4.000e10, 				"sprite" : "babyTech10.png", 		"require" : { "Baby" : 90  } },
	   33 : { "owner" : "Baby", 		"title" : "The name is Johnson", 	"desc" : "- Families worldwide is so excited for the their new baby pooping that they forgot to name them. -",											"effect" : "Baby Multiplier +3.0", 			"multiplier" :   3.00, 		"cost" : 2.500e11, 				"sprite" : "babyTech11.png", 		"require" : { "Baby" : 100 } }

	//NEED TO UPDATE SESSION STATE
	//NEED TO UPDATE RESET
	//NEED TO UPDATE LOAD
	};


	//=======================================================================
	// TECHTREE - SEARCH METHODS
	//=======================================================================
		function getTechTreeLength( )       { return Object.keys( techTree ).length; }
		function getAllTechId( ) 			{ return Object.keys( techTree );	}

		function getTechTree( ) 			{ return techTree; }
		function getTechById( id )		    { return techTree[id]; }
		function getTechRequirement( id )   { return techTree[id]["require"]; }
		function getTechMultiplier( id )    { return techTree[id]["multiplier"]; }
		function getTechCost( id ) 			{ return techTree[id]["cost"]; }
		function getTechSprite( id )		{ return techTree[id]["sprite"]; }



		//===================================================================
		// selectAllTechByProperty
		// 	SPECIFICALLY PICK PROPERTIES FROM GAME DATA
		//===================================================================
		function selectAllTechByProperty( ...prop ) {
			let record = {};

			getAllTechId( ).forEach( (element) => {
				record[element] = {};

				prop.forEach( (_p) => {
					record[element][_p] = techTree[element][_p];
				});
			});

			return record;
		}


	//=======================================================================
	// TECHTREE - VALIDATION METHODS
	//=======================================================================
		//=======================================================================
		// isTechEligible
		//		CHECK IF YOUR CURRENT UPGRADE LEVEL IS ELIGIBLE FOR UPGRADE
		//=======================================================================
		function isTechEligible( ST_Upgrade, ST_TechID ) {
			let retValue = true; 	//Tech is default upgrade, please give logical reason for not.
			let techReq  = getTechRequirement( ST_TechID );

			for( key in techReq ) {
				let sessionLevel = ST_Upgrade[key]["level"];
				let requireLevel = techReq[key];

				if( sessionLevel < requireLevel ) {
					retValue = false;
					break;
				}
			}

			return retValue;	//If all requirement is met, it will return true	
		}

		//===================================================================
		// Method		: getPurchasbleTechTreeUpgrade( ) 
		// Description : get All the TechTree upgrade that passes
		//				  purchase requirement.  This is done by comparing
		//				  $ST._playerState["TechTree"] with 
		//				  GameData._techTree.
		//
		// Return Type  : Array of Keys
		//				   Keys inserted within the array have passed the
		//				   test.  It can be use to process and dynamically
		//				   add techIcons.
		//===================================================================
		function getPurchasbleTechTreeUpgrade( ) {
			let retValue = [];

			//GET ALL LOCKED TECH FROM THE PLAYER
			let sessionStatTech = $ST.getAllLockedTech( );

			//CHECK EACH LOCKED TECH TO SEE WHICH IS PURCHASABLE
			for( let key in sessionStatTech ) {
				if( isTechEligible( $ST.getUpgradeList( ), key ) ) {
					retValue.push( key );
				}
			}

			return retValue;
		}




	//==============================================================================
	// const message
	//		Random Message act as a storyboard that tells a story about the world
	//
	//		Data Type: 	Object
	//		Values: 	Message Object
	//==============================================================================	
	const message = {
		1 : { "quote" : "I smell something funny on my hand...", 													"require" : { "Hand" :   0 } },
		2 : { "quote" : "Poo is beginning to emerge - reported by fellow humans",		        					"require" : { "Hand" :   0 } },
		3 : { "quote" : "I feel the urge to clean this up but I smeared it everywhere.",   							"require" : { "Hand" :   2 } },
		4 : { "quote" : "Rumor have been spreading that people is pooping at random places.",   					"require" : { "Hand" :  10 } },
		5 : { "quote" : "My kid found a dead plant but it turns out that it is only covered in poo.",   			"require" : { "Hand" :  20 } },
		6 : { "quote" : "Rumor is spreading that a mysterious person is responsible for the poo.",      			"require" : { "Hand" :  30 } },
		7 : { "quote" : "I looked into the distant land and saw that it is brown.",      							"require" : { "Hand" :  40 } },
		8 : { "quote" : "Animals have keen sense of smell and they don't like the smell of poo.",      				"require" : { "Hand" :  50 } },
		9 : { "quote" : "Researchers have found that the earth is turning into poo.",      	            			"require" : { "Hand" :  60 } },
	   10 : { "quote" : "Architecture discovered that building with poo makes a building sturdier.",    			"require" : { "Hand" :  70 } },
	   11 : { "quote" : "Government is declaring that poo will soon be the new currency.",      	    			"require" : { "Hand" :  80 } },
	   12 : { "quote" : "Science research made a breakthrough in turning silver into poo.",      	    			"require" : { "Hand" :  90 } },
	   13 : { "quote" : "Citizen reported that they are funnelling poo into the rivers, turning fish to poo.",      "require" : { "Hand" : 100 } }
	}

	//==============================================================================
	// MESSAGE - SEACH METHODS
	//==============================================================================
		function getMessageID( id ) 		 { return message[ id ]; }
		function getMessageQuoteById( id )   { return message[ id ][ "quote" ]; }
		function getMessageRequireById( id ) { return message[ id ][ "require"]; }
		function getMessageLength( ) 		 { return Object.keys( message ).length; }
		function getAllMessageID( ) 		 { return Object.keys( message ); }

		function getMessageBoardUpdate( ) {
			$ST.resetStoryBoard( );

			for( let id in message ) {
				if( checkRequirement( $ST.getUpgradeList( ), getMessageRequireById( id ) ) ) {
					$ST.addRandomMessage( message[id]["quote"] );
				}
			}
		}




	//==============================================================================
	// MESSAGE - VALIDATION METHODS
	//==============================================================================
		function checkRequirement( sessionStateUpgrades, requirement ) {
			let retValue = true;	//Prove it wrong

			//GET EVERY SINGLE TOOLS INSIDE THE REQUIRMENT
			for( let tool in requirement ) {
				let curLevel = $ST.getLevel( tool );

				if( curLevel < requirement[tool] ) { retValue = false; }
			}

			return retValue;
		}


	//==============================================================================
	// const Achievements
	//		List of all the achivements that you can have in the game.
	//==============================================================================	
	const achievement = {
		1 : { "title" : "Try it First Hand", 	"desc" : "Who could've done this horrible deed?!", 												"sprite" : "chevo1.png",			"require" : { "Hand" : 1   } },
		2 : { "title" : "Who Gives a Poo", 		"desc" : "People simply do whatever they want and they don't really care.", 					"sprite" : "chevo2.png",			"require" : { "Hand" : 10  } },
		3 : { "title" : "Back Handed", 			"desc" : "I just cleaned this spot, now there is twice as much poo?!.", 						"sprite" : "chevo3.png",			"require" : { "Hand" : 25  } },
		4 : { "title" : "Sleight of Hand", 		"desc" : "It looks like there is only 1 piece of poo, but there are actually hundreds!", 		"sprite" : "chevo4.png",			"require" : { "Hand" : 50  } },
		5 : { "title" : "Filthy Hand", 			"desc" : "You really outdone yourself in this world. Someone gotta do the dirty work right?", 	"sprite" : "chevo5.png",			"require" : { "Hand" : 100 } },

		6 : { "title" : "Ya Dig?",   			"desc" : "I am digging the smell of poo", 														"sprite" : "chevo6.png", 			"require" : { "Shovel" : 1   } },
		7 : { "title" : "Dig right in~",   		"desc" : "Yea know you want them poo", 															"sprite" : "chevo7.png", 			"require" : { "Shovel" : 10  } },
		8 : { "title" : "What's the scoop?",   	"desc" : "Spreading the news how wonderfully happy you are looking for poo.", 					"sprite" : "chevo8.png", 			"require" : { "Shovel" : 25  } },
		9 : { "title" : "Define Muck",   		"desc" : "Dictionary meaning now defines muck as poo since all we think about is poo.", 		"sprite" : "chevo9.png", 			"require" : { "Shovel" : 50  } },
	   10 : { "title" : "Dig Deep",   			"desc" : "There is no depth in the world that would satisfy human curiosity about poo.", 		"sprite" : "chevo10.png", 			"require" : { "Shovel" : 100 } },

	   11 : { "title" : "Yea Baby!",   			"desc" : "Let us all welcome baby Thomas!!", 													"sprite" : "chevo11.png", 			"require" : { "Baby" : 1   } },
	   12 : { "title" : "I am born to Poo",   	"desc" : "It feels like this is all I am doing, cleaning poo.", 								"sprite" : "chevo12.png", 			"require" : { "Baby" : 10  } },
	   13 : { "title" : "Day Care Center",   	"desc" : "There is never enough babies in one room - Ka$hing -", 								"sprite" : "chevo13.png", 			"require" : { "Baby" : 25  } },
	   14 : { "title" : "Growing Pain",   		"desc" : "My children have this problem... he likes to throw poo around...", 					"sprite" : "chevo14.png", 			"require" : { "Baby" : 50  } },
	   15 : { "title" : "Baby keeps giving",   	"desc" : "Baby's poo is a gift that keeps on giving.", 											"sprite" : "chevo15.png", 			"require" : { "Baby" : 100 } },

	   16 : { "title" : "Poo Happens", 			"desc" : "Something fell on my face, I wonder what it is?", 									"sprite" : "chevo16.png",			"require" : { "TotalPoo"    : 1       } },
	   17 : { "title" : "Brave Soul",  			"desc" : "Let's clean up this world.", 															"sprite" : "chevo17.png", 			"require" : { "TotalPoo"    : 1.000e7 } }
	};


	function getAchievementById( id )      { return achievement[ id ]; }
	function getAchievementReqById( id )   { return achievement[ id ]["require"]; }
	function getAchievementTitleById( id ) { return achievement[ id ]["title"]; }
	function getAchievementDescById( id )  { return achievement[ id ]["desc"];  }
	function getAchievementLength( )       { return Object.keys( achievement ).length; }

	function checkAchievement( currentAchievement ) {
		let retValue   = [];	//RETURNs WHICH ACHIEVEMENT HAD BEEN UNLOCKED
		
		for( chevoId in currentAchievement ) {
			if( currentAchievement[ chevoId ] == 0 ) {
				//FIND ALL THE ACHIEVEMENTS THAT IS LOCKED
				//IF IT IS LOCKED, CHECK TO SEE IF IT IS ELIGIBLE FOR UNLOCK
				let chevoEligible = true;	//FIND THE FIRST REQUIREMENT FALSE

				//LOOP THROUGH ALL THE ACHIEVEMENT IN THE DATABASE
				let chevoObj    = getAchievementReqById( chevoId );		// 1 : { "TotalPoo" : 1 }
				let requirement = Object.keys( chevoObj );

				requirement.forEach( function( element ) {
					switch( element ) {
						case "TotalPoo":
							let totalPoo = $ST.getTotalPoo( );
							if( totalPoo < chevoObj["TotalPoo"]) { chevoEligible = false; }
						break;

						case "Click":
							let totalClick = $ST.getTotalClicks( );
							if( totalClick < chevoObj["Click"] ) { chevoEligible = false; }
						break;

						case "Hand":
							let handLevel  = $ST.getLevel( "Hand" );
							if( handLevel < chevoObj["Hand"] ) { chevoEligible = false; }
						break;

						case "Baby":
							let babyLevel  = $ST.getLevel( "Baby" );
							if( babyLevel < chevoObj["Baby"] ) { chevoEligible = false; }
						break;

						case "Shovel":
							let shovelLevel  = $ST.getLevel( "Shovel" );
							if( shovelLevel < chevoObj["Shovel"] ) { chevoEligible = false; }
						break;

						default:
							chevoEligible = false;
						break;
					}
				});

				//IF ALL THE REQUIREMENT IS MEET, UNLOCK THE ACHIEVEMENT
				//POP UP ALL THE ACHIEVEMENT FOR THE PLAYER TO SEE
				if( chevoEligible ) { 
					$ST.setAchievementById( chevoId, 1 );
					retValue.push( chevoId ); 
				}
			}
		}
		return retValue;
	}


	function getAllChevoId( ) {
		return Object.keys( achievement );
	}

	//===================================================================
	// selectAllChevoByProperty
	// 	SPECIFICALLY PICK PROPERTIES FROM GAME DATA
	//===================================================================
	function selectAllChevoByProperty( ...prop ) {
		let record = {};

		getAllChevoId( ).forEach( (element) => {
			record[element] = {};

			prop.forEach( (_p) => {
				record[element][_p] = achievement[element][_p];
			});
		});

		return record;
	}


	//==============================================================================
	// RETURN
	//		return a series of methods that is allow to be publically access.
	//==============================================================================	
	return {
		//==========================================
		// UPGRADES 										NEW - UPDATED CODE IS HERE
		//==========================================
		upgrade        				: upgrade,						// require delete when it is live

		getUpgradeByName 			: getUpgradeByName,
		getUpgradeFactor 			: getUpgradeFactor,
		getUpgradeBase   			: getUpgradeBase,
		getUpgradePPS    			: getUpgradePPS,
		getUpgradeRefund 			: getUpgradeRefund,
		getAllUpgradeName  			: getAllUpgradeName,

		selectAllUpgradeByProperty 	: selectAllUpgradeByProperty,

		calcPrice      				: calcPrice,
		calcSumPrice   				: calcSumPrice,
		calcSellPrice  				: calcSellPrice,
		calcAllPPS     				: calcAllPPS,

		//==========================================
		// TECH TREE
		//==========================================
		getTechTree   	   			 : getTechTree,					// require delete when it is live

		getTechTreeLength   		 : getTechTreeLength,
		getTechById	    			 : getTechById,
		getTechRequirement  		 : getTechRequirement,
		getTechMultiplier   		 : getTechMultiplier,
		getTechCost         		 : getTechCost,
		getTechSprite       		 : getTechSprite,
		getAllTechId				 : getAllTechId,
		
		selectAllTechByProperty		 : selectAllTechByProperty,

		isTechEligible 				 : isTechEligible,
		getPurchasbleTechTreeUpgrade : getPurchasbleTechTreeUpgrade,
		


		//==========================================
		// MISC
		//==========================================
		getUpgradeTabs : getUpgradeTabs,
		getQuantity    : getQuantity,


		//==========================================
		// MESSAGE BOARD
		//==========================================
		getMessageBoardUpdate : getMessageBoardUpdate,


		//==========================================
		// ACHIEVEMENTS
		//==========================================
		checkAchievement   		 : checkAchievement,
		getAchievementById 		 : getAchievementById,
		getAchievementLength 	 : getAchievementLength,
		selectAllChevoByProperty : selectAllChevoByProperty
	};
}