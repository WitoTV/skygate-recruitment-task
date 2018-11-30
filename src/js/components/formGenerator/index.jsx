import React from 'react';
import DB from 'global/formDB';
import api from 'global/api'
import Field from './components/field';
import FormContext from 'global/context';

class FormGenerator extends React.Component {
	constructor(props) {
		super(props);
		this.db = new DB();
		this.state = {
			fieldTemplate: {
				parent: -1,
				question: '',
				type: 'text'
			},
			fields: [],
			context: {
				updateOrCreateField: this.updateOrCreateField.bind(this),
				deleteField: this.deleteField.bind(this),
				updateSubFieldCondition: this.updateSubFieldCondition.bind(this)
			}
		}
	}
	componentDidMount() {
		this.getForm();
	}
	getForm() {
		api().then((fields) => {
			this.setState({fields});
		})
	}
	updateOrCreateField(field) {
		this.db.set(field)
		.then(() => {
			this.getForm();
		})
	}
	deleteField(id) {
		this.db.delete(id)
		.then(() => {
			this.db.get('parent', id)
			.then((childFiels) => {
				this.getForm();
				childFiels.map((childField) => {
					this.db.delete(childField.id)
					.then(() => this.getForm());
				});
			})
		})
	}
	updateSubFieldCondition(id, type) {
		this.db.get('parent', id)
		.then((childFiels) => {
				this.getForm();
				childFiels.map((childField) => {
					let condition = childField.condition;
					condition.rule = '';
					if (type !== 'number' && condition.type !== 'equal') {
						condition.type = 'equal';
					}
					if (type === 'boolean') {
						condition.rule = true;
					}
					this.db.set({...childField, parentType: type, condition})
					.then(() => this.getForm());
				});
			})
	}
	render() {
		const {fields, fieldTemplate, context} = this.state;
		const template = (
			<FormContext.Provider value={context}>
				<div className={'form-wrapper--edit'}>
					<div className={'form-wrapper__header'}>Form builder</div>
					{fields.map((field) => <Field key={field.id} field={field} />)}
					<div className={'form-wrapper__buttons'}>
						<button onClick={() => context.updateOrCreateField(fieldTemplate)}>Add Field</button>
					</div>
				</div>
			</FormContext.Provider>
		)
		return template;
	}
}


export default FormGenerator;