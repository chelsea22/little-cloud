const mongoose = require('mongoose');

//Folder Schema
const folderSchema = mongoose.Schema({
	name:{
		type: String,
		required: true
	},
	foldersChildren: Array,
    filesChildren: Array,
	create_date:{
		type: Date,
		default: Date.now
	}
});

const Folder = module.exports = mongoose.model('Folder', folderSchema);