import React, { Component } from "react";

export default class Example extends Component {
    render( ) {
        return (
            <div>
               { this.moreTags( ) }
            </div>
        );
    }

	moreTags( ) {
        const iter = 3;
		let test = [];

		for( let i = 0; i < iter; i++ ) {
			test.push( <p key={i}>Hello world: {i}</p> );
		}
		return test;
	}
}