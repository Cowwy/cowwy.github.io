const state = {
    activeSection : "aboutMe"
};

window.onload = function( ) {
    initControls( );
}

function initControls( ) {
    $( "#aboutMe, #project, #contact, #aboutMe2, #project2, #contact2" ).click( ( e ) => {

        const curId = ( e.currentTarget.id ).replace( "2", "" );   //aboutMe
        const prev  = state.activeSection;

        if( curId != prev ) {
            //previous active link becomes deactivated.
            //previous section becomes display none.
            $( `#${prev}Section`).toggleClass( "show" );
            $( `#${curId}Section` ).toggleClass( "show" );

            $( `#${prev}` ).toggleClass( "active" );
            $( `#${prev}2` ).toggleClass( "active" );

            $( `#${curId}` ).toggleClass( "active" );
            $( `#${curId}2` ).toggleClass( "active" );

            $( `#burger-menu-list` ).addClass( "hide" );
            $( "#burger-menu" ).removeClass( "lightOn" );

            state["activeSection"] = curId;
        }
    });

    $( "#burger-menu" ).click( ( e ) => {
        $( "#burger-menu" ).toggleClass( "lightOn" );
        $( "#burger-menu-list" ).toggleClass( "hide" );
    });    
}