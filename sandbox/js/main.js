const state = {
    activeSection : "aboutMe"
};

window.onload = function( ) {
    initControls( );

    // const output = document.getElementById( "output" );
    // const str = screen.availWidth + " x " + this.screen.availHeight;

    // output.innerHTML += str + "<br/>";
    // output.innerHTML += screen.width + " x " + this.screen.height + "<br/>";
    // output.innerHTML += window.devicePixelRatio + "<br/>";
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