import React from 'react';

import './style.scss';

class Field extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			checkValue: (() => {
				if (this.props.field.type === 'boolean') {
					return true
				} else {
					return '';
				}
			})(),
		}
		this.setValue = this.setValue.bind(this);
	}
	setValue(e) {
		let value = e.target.value;
		this.setState({checkValue: value});
	}
	render() {
		const {checkValue} = this.state;
		const {field} = this.props;
		const template = (
			<React.Fragment>
				<div className={'field'}>
					<div className={'field__anwser'}>
						<label>
							{field.question}
						</label>
						{field.type !== 'boolean' ? (
							<input type={field.type === 'number' ? 'number' : 'text'} name={'condition-rule'} onChange={this.setValue} />
						) : (
							<select name={'condition-rule'} onChange={this.setValue}>
								<option value={true}>Yes</option>
								<option value={false}>No</option>
							</select>
						)
						}
					</div>
					{field.subFields && <div className={'field__subfields'}>
						{field.subFields.map((subField) => {
							if (subField.parentType === 'number') {
								if (subField.condition.type === 'greater' && Number(subField.condition.rule) > Number(checkValue)) {
									return (<Field key={subField.id} field={subField} />);
								}
								if (subField.condition.type === 'less' && Number(subField.condition.rule) < Number(checkValue)) {
									return (<Field key={subField.id} field={subField} />);
								}
								if (subField.condition.rule.toString() === checkValue.toString()) {
									return (<Field key={subField.id} field={subField} />);
								}
							} else {
								if (subField.condition.rule.toString() === checkValue.toString()) {
									return (<Field key={subField.id} field={subField} />);
								}
							}

						})}
					</div>}
				</div>
			</React.Fragment>
		);
		return template;
	}
}

export default Field;