import React, { Component } from 'react';

export default class Counter extends Component {
	// state = {
	// 	value : this.props.counter.value
	// };

	//<button onClick={ this.handleIncrement } className="btn btn-secondary btn-sm">Increment</button>

	// reset = ( ) => {
	// 	this.setState( { count : 0 });
	// }

	// handleIncrement = ( ) => {
	// 	this.setState( { value : this.state.value + 1 } );
	// }

	componentDidUpdate( prevProps, prevState ) {
		console.group( "Update Phase" );
			console.log( 'PrevProps', prevProps );
			console.log( 'PrevState', prevState );
		console.groupEnd( );
	}

	componentWillUnmount( ) {
		console.group( "Unmount Phase" );
		console.groupEnd( );
	}
	
	render( ) {
		console.log( "Counter - Rendered" );

		return (
			<div>
				<span className={ this.getBadgeClasses( ) }>{ this.formatCount( ) }</span>
				<button onClick={ ( ) => this.props.onClick( this.props.counter ) } className="btn btn-secondary btn-sm">Increment</button>
				<button onClick={ ( ) => this.props.onDelete( this.props.counter.id ) } className="btn btn-danger btn-sm m-2">Delete</button>
			</div>
		);
	}

	

	getBadgeClasses( ) {
		let classes = "badge m-2 ";
		classes += (this.props.counter.value === 0) ? "badge-warning" : "badge-primary";
		return classes;
	}

	formatCount( ) {
		const { value } = this.props.counter;
		return value === 0 ? "Zero" : value;
	}
}

Counter.prototype.aboutMe = function( ) {
	console.log( "you can't see me" );
}