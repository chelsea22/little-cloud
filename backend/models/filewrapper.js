const mongoose = require('mongoose');

//FileWrapper Schema
const fileWrapperSchema = mongoose.Schema({
	name:{
		type: String,
		required: true
	},
    type:{
        type: String,
        required: true
	},
	size:{
		type: Number,
		required: true
	},
	create_date:{
		type: Date,
		default: Date.now
	},
	fs_file_id:{
		type: String,
		required: true
	}
});

const FileWrapper = module.exports = mongoose.model('FileWrapper', fileWrapperSchema);