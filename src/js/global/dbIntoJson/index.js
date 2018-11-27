import DB from 'global/formDB';

const response = () => {
	const db = new DB();
	return db.getAll()
		.then((data) => {
			return getNestedFields(data, -1);
		})
}

export default response;

function getNestedFields(arr, parent) {
	let out = []
	arr.map((field) => {
		if(field.parent == parent) {
			let fields = getNestedFields(arr, field.id)
			if(fields.length) {
				 field.subFields = fields
			}
			out.push(field)
		}
	})
	return out
}