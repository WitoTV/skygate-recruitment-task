import React from 'react';
import FormContext from 'global/context';

import './style.scss';

class Field extends React.Component {
	constructor(props) {
		super(props);
		this.setType = this.setType.bind(this);
		this.setQuestion = this.setQuestion.bind(this);
		this.setCondition = this.setCondition.bind(this);
	}
	setQuestion(e) {
		const {updateOrCreateField} = this.context;
		let value = e.target.value;
		updateOrCreateField({...this.props.field, question: value});
	}
	setCondition(e) {
		const {updateOrCreateField} = this.context;
		let name = e.target.name;
		let value = e.target.value;
		let condition = this.props.field.condition;
		if (name === 'condition-type') {
			condition.type = value;
		} else {
			condition.rule = value;
		}
		updateOrCreateField({...this.props.field, condition});
	}
	setType(e) {
		const {updateOrCreateField, updateSubFieldCondition} = this.context;
		let value = e.target.value;
		updateOrCreateField({...this.props.field, type: value});
		updateSubFieldCondition(this.props.field.id, value);
	}
	render() {
		const {field} = this.props;
		const {updateOrCreateField, deleteField} = this.context;
		const template = (
			<div className={'edit-field'}>
				{field.parent !== -1 && (
					<div className={'edit-field__condition'}>
						<label>
							Condition:
						</label>
						<select value={field.condition.type} name={'condition-type'} onChange={this.setCondition}>
							<option value='equal'>Equals</option>
							{field.parentType === 'number' && (
								<React.Fragment>
									<option value='less'>Greater than</option>
									<option value='greater'>Less than</option>
								</React.Fragment>
							)}
						</select>
						{field.parentType !== 'boolean' ? (
							<input type={field.parentType === 'number' ? 'number' : 'text'} value={field.condition.rule} name={'condition-rule'} onChange={this.setCondition} />
						) : (
							<select value={field.condition.rule} name={'condition-rule'} onChange={this.setCondition}>
								<option value={true}>Yes</option>
								<option value={false}>No</option>
							</select>
						)
						}
					</div>
				)}
				<div className={'edit-field__question'}>
					<label>Question:</label>
					<input onChange={this.setQuestion} defaultValue={field.question} />
				</div>
				<div className={'edit-field__question'}>
					<label>Type:</label>
					<select onChange={this.setType} value={field.type}>
						<option value={'text'}>Text</option>
						<option value={'number'}>Number</option>
						<option value={'boolean'}>Yes/No</option>
					</select>
				</div>
				<div className={'edit-field__controls'}>
					<button onClick={() => updateOrCreateField({parent: field.id, type: 'text', question: '', parentType: field.type, condition: {type: 'equal', rule: ''}})}>Add Sub-Field</button>
					<button onClick={() => deleteField(field.id)}>Delete</button>
				</div>
				<div className={'edit-field__subfields'}>
					{!!field.subFields && field.subFields.map((subField) => <Field key={subField.id} field={subField} />)}
				</div>
			</div>
		);
		return template;
	}
}

Field.contextType = FormContext;
export default Field;
