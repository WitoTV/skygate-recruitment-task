import React from 'react';
import DB from 'global/formDB';

import './style.scss';

class Field extends React.Component {
	constructor(props) {
		super(props);
		this.db = new DB();
		this.state = {
			'field': {
				'question': '',
				'type': 'text',
			},
			'subFields': []
		}
		this.findField = this.findField.bind(this);
		this.findSubFields = this.findSubFields.bind(this);
		this.updateField = this.updateField.bind(this);
	}
	componentDidMount() {
		this.findField();
	}
	findField() {
		const {id} = this.props;
		this.db.get('id', id)
		.then((data) => {
			this.setState({'field': data[0]})
			this.findSubFields(data[0].id);
		})
	}
	findSubFields(id) {
		const {field} = this.state;
		this.db.get('parent', id)
		.then((data) => {
			data = data.map((singleField) => {
				singleField.parentType = field.type;
				return singleField;
			})
			this.setState({'subFields': data})
		})
	}
	addSubField(id) {
		this.db.set({'parent': id, 'type': 'text'})
		.then(() => {
			this.findSubFields(id);
		})
	}
	updateField(e) {
		const {field} = this.state;
		const name = e.target.name;
		const value = e.target.value;
		let newField = {...field, [name]: value};
		this.db.set(newField)
		.then(() => {
			this.setState({field: newField})
			this.findSubFields(field.id);
		});
	}
	render() {
		const {subFields, field} = this.state;
		const {id, onDelete, parentType} = this.props;
		const template = (
			<fieldset>
				{field.parent !== -1 && <div>
					<label>Condition</label>
					{parentType}
				</div>}
				<div>
					<label>Question</label>
					<input defaultValue={field.question} name={'question'} onChange={this.updateField} />
				</div>
				<div>
					<label>Type</label>
					<select defaultValue={field.type} name={'type'} onChange={this.updateField}>
						<option value={'text'}>Text</option>
						<option value={'number'}>Number</option>
						<option value={'boolean'}>Yes/No</option>
					</select>
				</div>
				<button onClick={() => this.addSubField(id)}>Add sub field</button>
				<button onClick={() => onDelete(id)}>Delete Field</button>
				{subFields.map((field) => <Field key={field.id} onDelete={onDelete} parentType={field.parentType} id={field.id} />)}
			</fieldset>
		);
		return template;
	}
}

export default Field;