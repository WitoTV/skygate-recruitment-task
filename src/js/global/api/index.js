import DB from 'global/formDB';

const response = () => {
	const db = new DB();
	return db.getAll()
		.then((data) => {
			return getNestedFields(data, -1);
		})
}

export default response;

const getNestedFields = (array, parent) => {
	let output = []
	array.map((field) => {
		if(field.parent == parent) {
			let fields = getNestedFields(array, field.id)
			if(fields.length) {
				 field.subFields = fields;
			}
			output.push(field)
		}
	})
	return output;
}