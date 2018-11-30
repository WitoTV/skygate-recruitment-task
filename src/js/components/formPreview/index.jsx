import React from 'react';
import response from 'global/api';
import Field from './components/field';
import {Link} from 'react-router-dom';

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
			<React.Fragment>
				{!fields.length && (<div className={'form-wrapper--empty'}>Form does not have any fields. Please add them <Link to={'/generator'}>here</Link></div>)}
				{!!fields.length && <form className={'form-wrapper'}>
					{fields.map((field) => <Field key={field.id} field={field} />)}
				</form>}
			</React.Fragment>
		)
		return template;
	}
}

export default FormPreview;