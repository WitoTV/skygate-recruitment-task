import React from 'react';
import Field from './components/field';
import DB from 'global/formDB';

class FormGenerator extends React.Component {
	constructor(props) {
		super(props);
		this.db = new DB();
		this.state = {
			'fields': []
		}
		this.findAllBaseFields = this.findAllBaseFields.bind(this);
		this.addBaseField = this.addBaseField.bind(this);
		this.onFieldDelete = this.onFieldDelete.bind(this);
	}
	componentDidMount() {
		this.findAllBaseFields();
	}
	findAllBaseFields() {
		this.db.get('parent', -1)
		.then((fields) => {
			this.setState({fields});
		})
	}
	addBaseField() {
		this.db.set({'parent': -1, 'type': 'text'})
		.then(() => {
			this.findAllBaseFields();
		})
	}
	onFieldDelete(id) {
		this.db.delete(id)
		.then(() => {
			this.findAllBaseFields();
		})
	}
	render() {
		const {fields} = this.state;
		const template = (
			<React.Fragment>
				{fields.map((field) => <Field key={field.id} onDelete={this.onFieldDelete} id={field.id} />)}
				<button onClick={this.addBaseField}>Add field</button>
			</React.Fragment>
		)
		return template;
	}
}

export default FormGenerator;