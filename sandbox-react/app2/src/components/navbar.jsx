// import React, { Component } from 'react';
import React from 'react';


//stateless Functional Component
const NavBar = ( props ) => {
    console.log( "NavBar - Rendered" );

    return (
        <nav className="navbar navbar-light bg-light">
            <a href="" className="navbar-brand">
                Navbar <span className="badge badge-pill badge-secondary">
                    {props.totalCounters }
                </span>
            </a>
        </nav>
    );
}

export default NavBar;

// export default class NavBar extends Component {
//     render( ) {
//         return (
//             <nav className="navbar navbar-light bg-light">
//                 <a href="" className="navbar-brand">
//                     Navbar <span className="badge badge-pill badge-secondary">
//                         {this.props.totalCounters }
//                     </span>
//                 </a>
//             </nav>
//         );
//     }
// }