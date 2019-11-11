import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import 'bootstrap/dist/css/bootstrap.css';

import App from "./App";
// import Counter from './components/counter.jsx';
// import Counters from './components/counters.jsx';
// import Example from './components/examples.jsx';

import * as serviceWorker from './serviceWorker';

const sessionState = {
    name : "Frankie",
    age  : 100
};

ReactDOM.render(<App test="Try" state={ sessionState }/>, document.getElementById('root') );
// ReactDOM.render(<Example />, document.getElementById('myComp') );

// const test = new Counter( );
// console.log( Object.getOwnPropertyNames( test ) );
// console.log( Object.keys( test ) );
// console.log( test.aboutMe( ) );

serviceWorker.unregister();

// console.log( React );
// console.log( Counter );