import React from 'react';
import ReactDOM from 'react-dom';
import FormGenerator from './components/formGenerator';
import FormPreview from './components/formPreview';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import 'scss/style.scss';

const app = (
	<Router>
		<Switch>
			<Route path={'/'} exact={true} component={FormPreview}/>
			<Route path={'/generator'} exact={true} component={FormGenerator} />
		</Switch>
	</Router>
);

const rootElement = document.getElementById('root');
ReactDOM.render(app, rootElement);