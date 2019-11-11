import React, { Component } from 'react';
import NavBar from './components/navbar';
import Counters from "./components/counters";

import './App.css';



export default class App extends Component {
  state = {
    counters: [
        { id : 1, value: 4 },
        { id : 2, value: 0 },
        { id : 3, value: 2 },
        { id : 4, value: 0 }
    ]
  };

  //MOUNTING PHASE 1
  constructor( props ) {
    super( props );

    //YOU CAN MOUNT AN INITIAL STATE OF THE PROGRAM THROUGH
    //THE APP OBJECT IN index.js

    //Only in the counstructor are you allow to set "this.state" directly
    //because the mounting process comes before the rendering.
    this.state["hero"] = props.state; 
    
    console.group( "Mount Phase 1" );
      console.log( 'App - Constructor', this.state );
      console.log( 'Passed Property', props );    
    console.groupEnd( );
  }

  ///MOUNTING PHASE 3
  componentDidMount( ) {
    console.groupEnd( 'App - Rendered Phase 2' );

    console.group( 'App - componentDidMount Phase 3' );
    console.groupEnd( );
  }

  handleReset = ( ) => {
    const counters = this.state.counters.map( c => {
        c.value = 0;
        return c;
    });

    this.setState( { counters } );
  }

  onIncrement = ( c ) => {
    const index = this.state.counters.indexOf( c );
    const tmpCounters = [ ...this.state.counters ];
    
    tmpCounters[index] = c;
    tmpCounters[index].value++;
    
    this.setState( { counters : tmpCounters } );
  }

  handleDelete = ( id ) => {
    const cState = this.state.counters;
    this.setState( 
        cState.splice( cState.findIndex( obj => obj.id === id ), 1 ) 
    );

    // const result = cState.filter( obj => obj.id !== id );
    // this.setState( { counters: result } );
  }

  ///MOUNTING PHASE 2
  render( ) {
    console.group( 'App - Rendered Phase 2' );

    return (
      <React.Fragment>
        <NavBar totalCounters={ this.state.counters.filter( c => c.value > 0 ).length } />

        <main className="container">
          <Counters 
            liftState={this.state.counters} 
            onReset={this.handleReset} 
            onIncrement={this.onIncrement} 
            onDelete={this.handleDelete} />
        </main>
      </React.Fragment>
    )
  };
}
