import React from 'react';
import ReactDOM from 'react-dom';
import FormGenerator from './components/formGenerator';

import 'scss/style.scss';

const app = (
	<FormGenerator />
);

const rootElement = document.getElementById('root');
ReactDOM.render(app, rootElement);