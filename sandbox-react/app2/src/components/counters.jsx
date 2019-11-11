import React, { Component } from 'react';
import Counter from "./counter";

export default class Counters extends Component {
    render( ) {
        console.log( "Counters - Rendered" );
        
        return (
            <div>
                <button onClick={ this.props.onReset } className="btn btn-primary btn-sm m-2">Reset</button>
                { this.props.liftState.map( (e) => 
                    <Counter 
                        key={ e.id } 
                        counter={e}
                        onDelete={ this.props.onDelete }
                        onClick={ this.props.onIncrement }    
                    />
                ) }
            </div>
        )
    }
}

