import React from 'react';
import DB from 'global/formDB';

import './style.scss';

class Field extends React.Component {
	constructor(props) {
		super(props);
		this.db = new DB();
		const {parentType} = this.props;
		this.state = {
			'field': {
				'question': '',
				'type': 'text',
				'condition': {
					'type': (() => {
						if (parentType === 'text') {
							return false;
						}
						if (parentType === 'number') {
							return 'less';
						}
						if (parentType === 'boolean') {
							return false;
						}
					})(),
					'value': (() => {
						if (parentType === 'text') {
							return '';
						}
						if (parentType === 'number') {
							return '';
						}
						if (parentType === 'boolean') {
							return true;
						}
					})()
				}
			},
			'subFields': []
		}
		this.addSubField = this.addSubField.bind(this);
		this.findField = this.findField.bind(this);
		this.findSubFields = this.findSubFields.bind(this);
		this.updateField = this.updateField.bind(this);
		this.setCondition = this.setCondition.bind(this);
	}
	componentDidMount() {
		this.findField();
	}
	findField() {
		const {id} = this.props;
		this.db.get('id', id)
		.then((data) => {
			console.log(data);
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
		const {parentType} = this.props;
		this.db.set({'parent': id, 'type': 'text', 'condition': {
					'type': (() => {
						if (parentType === 'text') {
							return false;
						}
						if (parentType === 'number') {
							return 'less';
						}
						if (parentType === 'boolean') {
							return false;
						}
					})(),
					'value': (() => {
						if (parentType === 'text') {
							return '';
						}
						if (parentType === 'number') {
							return '';
						}
						if (parentType === 'boolean') {
							return true;
						}
					})()
				}})
		.then(() => {
			this.findSubFields(id);
		})
	}
	updateField(e) {
		const {field} = this.state;
		const name = e.target.name;
		const value = e.target.value;
		this.db.set({...field, [name]: value})
		.then(() => {
			this.setState({field: {...field, [name]: value}})
			this.findSubFields(field.id);
		});
	}
	setCondition(e) {
		const {field} = this.state;
		const {parentType} = this.props;
		const name = e.target.name;
		const value = e.target.value;
		let condition = {
				type: false,
				value: ''
			}
		if (parentType === 'text' ) {
			condition = {
				type: false,
				value
			}
		}
		if (parentType === 'number') {
			if (name === 'condition-type') {
				condition = {
					type: value,
					value: field.condition.value
				}
			} else {
				condition = {
					type: field.condition.type,
					value
				}
			}
		}
		if (parentType === 'boolean') {
			condition = {
				type: false,
				value
			}
		}
		this.db.set({...field, condition})
		.then(() => {
			this.setState({field: {...field, condition}})
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
					{parentType === 'text' && (
						<React.Fragment>
							Equals:
							<input name={'condition-value'} value={field.condition.value} type={'text'} onChange={this.setCondition}  />
						</React.Fragment>
					)}
					{parentType === 'number' && (
						<React.Fragment>
							<select name={'condition-type'} value={field.condition.type} onChange={this.setCondition}>
								<option value={'less'}>Less than</option>
								<option value={'equal'}>Equal</option>
								<option value={'greater'}>Greater than</option>
							</select>
							<input name={'condition-value'} value={field.condition.value} type={'number'} onChange={this.setCondition}/>
						</React.Fragment>
					)}
					{parentType === 'boolean' && (
						<React.Fragment>
							Equals:
							<select name={'condition-value'} value={field.condition.value} onChange={this.setCondition}>
								<option value={true}>Yes</option>
								<option value={false}>No</option>
							</select>
						</React.Fragment>
					)}
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
				<button onClick={() => {onDelete(id)} }>Delete Field</button>
				{subFields.map((field) => <Field key={field.id} onDelete={onDelete} parentType={field.parentType} id={field.id} />)}
			</fieldset>
		);
		return template;
	}
}

export default Field;