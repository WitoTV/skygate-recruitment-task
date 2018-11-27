import React from 'react';
import response from 'global/dbIntoJson';

class FormPreview extends React.Component {
	constructor(props) {
		super(props)
		response().then((data) => {
			console.log(data);
		})
	}
	render() {
		return (<div />)
	}
}

export default FormPreview;