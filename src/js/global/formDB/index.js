import idb from 'idb';

class DB {
	constructor() {
		this.dbPromise = idb.open('myDB', 1, updateDB => {
			const co = updateDB.createObjectStore('fields', {
				keyPath: 'id',
				autoIncrement: true,
			});
			co.createIndex('id', 'id', {unique: true});
			co.createIndex('parent', 'parent', {unique: false});
			co.createIndex('type', 'type', {unique: false});
			co.createIndex('question', 'question', {unique: false});
			return co;
		});
		this.get = this.get.bind(this);
		this.getAll = this.getAll.bind(this);
		this.delete = this.delete.bind(this);
		this.set = this.set.bind(this);
	}
	get(index, key) {
		return this.dbPromise
			.then(db =>
				db
					.transaction('fields')
					.objectStore('fields')
					.index(index)
					.getAll(key),
			)
			.then(val => val);
	}
	getAll() {
		return this.dbPromise.then(db => {
			return db
				.transaction('fields')
				.objectStore('fields')
				.getAll();
		});
	}
	delete(id) {
		return this.dbPromise.then(db => {
			const tx = db.transaction('fields', 'readwrite');
			tx.objectStore('fields').delete(id);
			tx.objectStore('fields').getAll();

			return tx.complete;
		});
	}
	set(val) {
		return this.dbPromise.then(db => {
			const tx = db.transaction('fields', 'readwrite');
			tx.objectStore('fields').put(val);
			tx.objectStore('fields').getAll();
			
			return tx.complete;
		});
	}
}

export default DB;