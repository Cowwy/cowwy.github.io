//=======================================================
// Build Version 1.0 - July 1, 2019
//=======================================================
// The system develop current operating based on web
// logic.  However this imposes a problem with function
// trace stack unable to finish a function before the
// next part of the game begin.
// Over a long period of time function call will slowly
// drains of the memory available for the browser.
//
// The game is required to be switched to web based logic
// to Frame based logic allowing function to complete
// entirely.
//=======================================================


//=======================================================
// Build Version 1.0 - July 6, 2019
//=======================================================
// There is an issue with the AppSessionState object.
// Currently it is taking on too many role of taking
// care of how in game object is interacting with another
//
// Another dilemma is that, if I were to separate them
// I cannot keep AppSessionState information private.
//
// This problem had been solved.
//=======================================================


//=======================================================
// Build Version 1.0 - July 14, 2019
//=======================================================
// COMPLETED:
// 		Completed page Transition
// 		Added Background
// 		Added Poop - Not Clickable Yet
// 		Data can be save and loaded
// 		Multiple save game can be saved.
// 		Navigation, Footer and Statistic Panel (page4) added
//
// FUTURE DEVELOPMENT:
//	 [x] - Clicking the Poo will accumulate Poo
//   [x] - Change cursor to tiny shovel
//=======================================================


//=======================================================
// Build Version 1.0 - July 20, 2019
//=======================================================
// COMPLETED:
// 		Clickable Poo
//		Animated Pop up Number
//		Incorporated Initial Upgrade [Shovel]
//		Upgrade calculation
//		Upgrade Data
//		
// FUTURE DEVELOPMENT:
//	 [x] - Dynamically upgrade list
//	 [x] - Poo(Shit) analogy design
//
// GAME DESIGN:
//		Poo Analogy - Reflects on society's action
//		towards the environment.  We preceived to be
//		cleaning out the poo[shit], but we also invest
//		in a lot of poo[shit].  Each upgrade increases
//		the poo[shit] load in society until it implodes
//		with nonsense[shit].
//
//		5 Category of Upgrade
//		Normal -> Shovel
//			   -> Baby
//             -> Moo Moo Farm
//	           -> Bathroom
//
//		Political -> Manufacture
//                -> Bank
//                -> University
//                -> Radio Tower
//
//		Science -> Alchemy
//              -> Exploration
//              -> Portal
//              -> Astral Simulation
//
//		Pagan -> Temple
//            -> Wizard Tower
//            -> Lucky Charm
//            -> Dream Catcher
//
//		Demonic -> Alter of Sacrific
//              -> Conjour Symbol
//              -> Mirror
//              -> All Seeing Eye
//
//		Divine -> Churches
//			   -> Manuscripts
//			   -> 
//			    
//		Shit Meaning
//			1/ Feces
//			2/ The shit - A bad ass
//			3/ Shit son - Good work, I am impressed
//			4/ Nonsense - British meaning
//			5/ Foolishness
//			6/ Little Value or quality
//			7/ Shit talk - boastful or inaccurate speech
//			8/ Shit      - Expression for Surprise. SHIT!!
//			9/ Oh Shit   - Expression for Annoying.  Argh Shit
//         10/ SHIT!!!   - Expression for Anger
//         11/ Holy Shit - Expression for impressed
//						   Divine Poo concept
//         12/ We raised our children with Shit
//             so that they can grow up to produce shit
//         13/ Funny as shit
//=======================================================


//=======================================================
// Build Version 1.0 - July 23, 2019
//=======================================================
//	COMPLETED:
// 		TOTAL CLICKS - Load/Save/Per Click Response
//		isUpgradeEligible( ) now returns true or false
//			based on upgrade availability.
//		changed setInititalState( ) to updateStatistics( );
//
//		
// FUTURE DEVELOPMENT:
//	 [x] - Poop per second - Automatically add poo to collection
//	 [ ] - Temporary Cartoon Upgrade Icons
//
//=======================================================


//=======================================================
// Build Version 1.0 - July 27, 2019
//=======================================================
//	COMPLETED:
// 		Poop Per Second - Upgrade will automatically added
//			to the PPS. Icon will automatically adjust
//			to amount of poo have accumulated.
//
//		
// FUTURE DEVELOPMENT:
//	 [x] - Reconile Code Design and rewrite it to be more
//		   readable.
//				- Game Constant  - All game constant should be in one object
//				- Session State  - Should only reserve for changing window
//				- Play Stats Obj - Holds all the player information within the game.
//				
//	 [x] - Temporary Cartoon Upgrade Icons - Shovel - Baby - Moo Moo Farm - Toilet
//	 [ ] - Add Documentation Section
//
//=======================================================


//=======================================================
// Build Version 1.0 - July 27, 2019
//=======================================================
//	COMPLETED:
// 		Temporary Art for each upgrade
//
//		
// FUTURE DEVELOPMENT:
//	 [x] - Save Game - Pop Up
//	 [ ] - Purchase Quantity by 10 & 100
//	 [ ] - Add Documentation Section
//   [ ] - Total Upgrades Purchased
//   [ ] - Add Tech Tree to Poo Tools
//	 [ ] - Random Story Message floating above Poop counter
//	 [ ] - World Name
//=======================================================