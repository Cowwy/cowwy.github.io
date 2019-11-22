const state = {
    activeSection : "aboutMe"
};

window.onload = function( ) {
    initControls( );

    const str = screen.availWidth + " x " + this.screen.availHeight;
    document.getElementById( "output" ).innerHTML = str;
}

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