$( document ).ready( function( e ) {
	//ADD FUNCTIONALITY TO BURGER BUTTON
	$(".burger").bind( 'click', ( e ) => {
		let display = $( "#burger-menu" ).css( "display" );

		display == "block" ?
			$( "#burger-menu" ).css( "display", "none" ) :
			$( "#burger-menu" ).css( "display", "block" );
		
	});

	//ADD FUNCTIONALITY TO BURGER-MENU
	$("#burger-menu").bind( 'click', ( e ) => {
		$( "#burger-menu" ).css( "display", "none" );
	});
});


const projectList = {
	1 : { "projectTitle" : "Pooper Clicker (WIP)",
		  "link"         : "http://cowwy.github.io/PooperClicker",
		  "desc"         : "HTML | CSS | VanillaJS" },

	2 : { "projectTitle" : "NoBul",
		  "link"         : "http://cowwy.github.io/recreate/project1",
		  "desc"         : "Static Web Page - HTML | SVG | CSS" },

	3 : { "projectTitle" : "Simona Rich",
		  "link"         : "http://cowwy.github.io/recreate/project2",
		  "desc"         : "Single Responsive Page - HTML | CSS" },

	4 : { "projectTitle" : "Juliana Rotich",
		  "link"         : "http://cowwy.github.io/recreate/project3",
		  "desc"         : "Full Responsive Site - HTML | CSS | VanillaJS" },

	5 : { "projectTitle" : "Contact Form",
		  "link"         : "http://cowwy.github.io/recreate/project4",
		  "desc"         : "CSS Flex | JQuery" },

	6 : { "projectTitle" : "CSS Grid - Pokedex",
		  "link"         : "http://cowwy.github.io/project5",
		  "desc"         : "CSS Grid" }
};

Object.freeze( projectList );