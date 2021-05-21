'use strict';

import React from "react";
import ReactDOM from "react-dom";
import App from "./App.jsx";

console.log('Load app', App, document.getElementById("root"))

ReactDOM.render(<App />, document.getElementById("root"));