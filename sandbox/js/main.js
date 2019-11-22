const state = {
    activeSection : "aboutMe"
};

window.onload = function( ) {
    initControls( );
    this.initSectionHeight( "aboutMe" );
}

function initSectionHeight( id ) {
    const screenHeight  = window.innerHeight;
    const footerHeight  = $( ".footer-area" )[0].offsetHeight;    
    const sectionHeight = $( `#${id}Section` )[0].offsetHeight;
    const padding = 160;

    // const dom = document.getElementById( id + "Section" );

    // console.log( $( `#${id}Section` )[0].offsetHeight );
    // console.log( dom );
    // console.log( dom.clientHeight );
    // console.log( dom.offsetHeight );
    // console.log( dom.scrollHeight );

    if( sectionHeight < (screenHeight - footerHeight) ) {
        const contact = document.getElementById( `${id}Section` );
        contact.style.height = (screenHeight - footerHeight - padding ) + "px";
    }
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

            initSectionHeight( curId );
        }
    });


}