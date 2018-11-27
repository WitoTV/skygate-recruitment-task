import React from 'react';

class Field extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			checkValue: '',
		}
		this.setValueCheck = this.setValueCheck.bind(this);
	}
	setValueCheck(e) {
		this.setState({checkValue: e.target.value})
	}
	render() {
		const {field} = this.props;
		const template = (
			<React.Fragment>
				<fieldset>
					<div>
						<label>
							{field.question}
						</label>
						<input onChange={this.setValueCheck} />
					</div>
					{field.subFields && field.subFields.map((singleField) => {
						console.log(this.state.checkValue, singleField.condition);
						<Field key={singleField.id} field={singleField} />
					})}
				</fieldset>
			</React.Fragment>
		);
		return template;
	}
}

export default Field;