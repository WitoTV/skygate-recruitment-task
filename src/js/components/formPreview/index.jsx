import React from 'react';
import response from 'global/dbIntoJson';
import Field from './components/field';
class FormPreview extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			fields: []
		}
	}
	componentDidMount() {
		response().then((data) => {
			this.setState({fields: data});
		})
	}
	render() {
		const {fields} = this.state;
		const template = (
			<form>
				{fields.map((field) => <Field key={field.id} field={field} />)}
			</form>
		)
		return template;
	}
}

export default FormPreview;