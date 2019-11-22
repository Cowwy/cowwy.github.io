const state = {
    activeSection : "project"
};

window.onload = function( ) {
    initControls( );
}

// function initSectionHeight( id ) {
//     const screenHeight  = window.innerHeight;
//     const footerHeight  = $( ".footer-area" )[0].offsetHeight;    
//     const sectionHeight = $( `#${id}Section` )[0].offsetHeight;
//     const padding = 160;

//     console.log( sectionHeight );

//     if( sectionHeight < (screenHeight - footerHeight - padding) ) {
//         $( ".footer-area" ).addClass( "fixedToBottom" );
//     } else {
//         $( ".footer-area" ).removeClass( "fixedToBottom" );
//     }
// }

function initControls( ) {
    $( "#aboutMe, #project, #contact" ).click( ( e ) => {
        const curId = e.currentTarget.id;   //aboutMe
        const prev  = state.activeSection;

        if( curId != prev ) {
            //previous active link becomes deactivated.
            //previous section becomes display none.
            $( `#${prev}Section`).toggleClass( "show" );
            $( `#${prev}` ).toggleClass( "active" );
            
            $( `#${curId}Section` ).toggleClass( "show" );
            $( `#${curId}` ).toggleClass( "active" );

            state["activeSection"] = curId;
        }
    });


}