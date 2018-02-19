import { Buffer } from 'buffer';
import fs from 'fs';

import express from 'express';
import config from './config';

import mongoose from 'mongoose';
import Grid from 'gridfs-stream';

const app = express();

app.use(express.json({limit: '100mb'}));
app.use(express.urlencoded({limit: '100mb'}));

//Bring in Models
const Folder = require('./models/folder');
const FileWrapper = require('./models/filewrapper');

//Connect to Mongodb
mongoose.Promise = global.Promise;
mongoose.connect(config.MONGO_URI);
const conn = mongoose.connection;

//Connect GridFS and Mongo
Grid.mongo = mongoose.mongo;
const gfs = Grid(conn.db);

//Check connection
conn.on('connected', () =>{
	console.log('Connected to MongoDB');
});
//Check for DB errors
conn.on('error', (err) =>{
	console.error(err);
});


//	Helpers Functions
//Form tree from db objects 
async function formTree(rootFolder){
	const folder = rootFolder._doc;

	let listOfFoldersIds = [ ...folder.foldersChildren ];
	let listOfFilesIds = [ ...folder.filesChildren ];
	
	let [ ...listOfFolders ] = await Promise.all(listOfFoldersIds.map( async id => await Folder.findById(id)));
	let [ ...listOfFiles ] = await Promise.all(listOfFilesIds.map( async id => await FileWrapper.findById(id)));

	let [ ...resList ] = await Promise.all(listOfFolders.map( async folder => await formTree(folder)));

	let tree = Object.assign({}, folder, { foldersChildren: resList, filesChildren: listOfFiles });
	return await tree;
}
//Delete Folder and all children
async function deleteFolder(id){
	const folderObj = await Folder.findById(id);
	let folder = folderObj._doc;
	folder.filesChildren.map( async id =>  await deleteFile(id));
	folder.foldersChildren.map( async id => await deleteFolder(id));
	let remove = await Folder.findByIdAndRemove(id);
}
//Delete File
async function deleteFile(id){
	let fileObj = await FileWrapper.findById(id);
	const fsFileId = fileObj.fs_file_id;
	let remove = await gfs.remove({ _id: fsFileId });
	let removeFW = await FileWrapper.findByIdAndRemove(id);
}

//Validate
function validate(data){
    let errors = {};
    if (data.name === '') errors.name = "Can't be empty";
    const isValid = Object.keys(errors).length === 0;
    return { errors, isValid };
}


//	Work with Tree
app.get('/root_folder_tree', async (req, res) => {
	try{
		if (!config.rootFolderId){
			let folder = await Folder.findOne({'name': 'Home'});
			if (!folder){
				let folder = new Folder();
				folder.name = 'Home';
				folder.foldersChildren = [];
				folder.filesChildren = [];
				const createdFolder = await folder.save();
				config.rootFolderId = createdFolder._doc._id;
			} else {
				config.rootFolderId = folder._doc._id;
			}
		}
		const homeId = config.rootFolderId;
		let folder = await Folder.findById(homeId);
		let tree = await formTree(folder);
		res.json({ folder: tree }); 
	} catch(err) {
		console.error(err);
		res.status(500).json({ errors: err })
	}
});


//	Work with Folders
app.post('/folders/:parent_id/folders', async (req, res) => {
	try {
		const { errors, isValid } = validate(req.body);
		if (isValid){
			const { name } = req.body;
			//Creat new Folder in db
			let newFolder = new Folder();
			newFolder.name = name;
			newFolder.foldersChildren = [];
			newFolder.filesChildren = [];
			let createdFolder = await newFolder.save();
			//Update rootFolder's foldersChildren
			let query = { _id: req.params.parent_id};
			let rootFolder = await Folder.findOne(query);
			const updatedFoldersChildren = [ ...rootFolder._doc.foldersChildren, createdFolder._doc._id].map(id => id.toString());
			const confirmUpdate = await Folder.update(query, { $set: { foldersChildren: updatedFoldersChildren }});
			res.status(200).json('Success!');
		} else {
			res.status(400).json({ errors });
		}
	}catch(err){
		console.error(err);
		res.status(500).json({ errors: err });
	}
});

app.put('/folders/:_id', async (req, res) => {
	try {
		const { errors, isValid } = validate(req.body);
		if (isValid){
			const { name } = req.body;
			let query = { _id: req.params._id}
			const confirm = await Folder.update(query, { $set: { name: name }})
			res.status(200).json('Success!');
		} else {
			res.status(400).json({ errors });
		}
	}catch(err){
		console.error(err);
		res.status(500).json({ errors: err });
	}
});

app.delete('/folders/:parent_id/folders/:_id', async( req,res) => {
	try {
		const { parentId, id } = req.body;
		const folderToDeleteId = id || req.params._id;
		let query = { _id: parentId || req.params.parent_id};
		//Remove all children from db and then folder
		let confirmRemove = await deleteFolder(folderToDeleteId);
		//Update rootFolder's foldersChildren
		let rootFolder = await Folder.findOne(query);
		const updatedFoldersChildren = rootFolder._doc.foldersChildren.filter(id => id != folderToDeleteId).map(id => id.toString());
		let confirmUpdate = await Folder.update(query, { $set: { foldersChildren: updatedFoldersChildren }});
		res.status(200).json('Success!');	
	}catch(err){
		console.error(err);
		res.status(500).json({ errors: err });
	}
});


//	Work with Files
app.get('/files/:_id', async (req, res) => {
	try{
		const fileId = req.params._id;
		const fileObj = await FileWrapper.findById(fileId);
		const fsFileId = fileObj.fs_file_id;
		const total = fileObj.size;

		if (req.headers.range) {
			let range = req.headers.range;
			let parts = range.replace(/bytes=/, "").split("-");
			let partialstart = parts[0];
			let partialend = parts[1];

			let start = parseInt(partialstart, 10);
			let end = partialend ? parseInt(partialend, 10) : total-1;
			let chunksize = (end-start)+1;

			const readstream = gfs.createReadStream({
				_id: fsFileId,
				range: {
					startPos: start,
					endPos: end
				}
			});
			res.writeHead(206, {
				'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
				'Accept-Ranges': 'bytes', 'Content-Length': chunksize,
				'Content-Type': 'video/mp4' 
			});
			readstream.pipe(res);

		} else {
			res.writeHead(200, { 'Content-Length': total, 'Content-Type': 'video/mp4' });
			gfs.createReadStream({ 
				_id: fsFileId, 
				range:{
					startPos: 0,
					endPos: total
				} 
			}).pipe(res);
		}
	} catch(err) {
		console.error(err);
		res.status(500).json({ errors: err });
	}
});

app.post('/folders/:parent_id/files', async (req, res) => {
	try{
		const { data, name: fileName, size: fileSize, type: fileType } = req.body;
		const b64Data = data.split(',')[1];
		const buffer = new Buffer(b64Data, 'base64');
		const pathTemp = './Temp'+ fileName.split('.')[0];
		try{
			const confirmWriteFile = await fs.writeFile(pathTemp, buffer, (err) => {
				if (err) {
					console.error(err);
					let errors = {};
					errors.writeFileSynck = "Error during writing the file!";
					res.status(400).json({ errors });
				}
			});
			
			const writeStreamToDB = gfs.createWriteStream({
				filename: fileName,
				fileSize: fileSize
			});

			fs.createReadStream(pathTemp).pipe(writeStreamToDB);
			const confirmWriteRecord = writeStreamToDB.on('close', async (file) => {
				//Creat new FilleWrapper in db
				let newFile = new FileWrapper();
				newFile.name = fileName;
				newFile.type = fileType;
				newFile.size = fileSize;
				newFile.fs_file_id = confirmWriteRecord.id;	
				let createdFile = await newFile.save();
				//Update rootFolder's filesChildren
				let query = { _id: req.params.parent_id};
				let rootFolder = await Folder.findOne(query);
				const updatedFilesChildren = [ ...rootFolder._doc.filesChildren, createdFile._doc._id].map(id => id.toString());
				let confirmUpdate = await Folder.update(query, { $set: { filesChildren: updatedFilesChildren }});

				fs.unlink(pathTemp, (err) => {
					if (err) console.error(err);
				});
				res.status(200).json({ succ:'Success!', file: createdFile._doc });
			});
	 	} catch(err) {
			fs.unlink(pathTemp, (err) => {
				if (err) console.error(err);
			});
			res.status(500).json({ errors: err });
		}
	}catch(err){
		console.error(err);
		res.status(500).json({ errors: err });
	}
});


app.put('/files/:_id', async (req, res) => {
	try {
		const { errors, isValid } = validate(req.body);
		if (isValid){
			const { name } = req.body;
			let query = { _id: req.params._id}
			const confirm = await FileWrapper.update(query, { $set: { name: name }});
			const updatedFile = await FileWrapper.findById(req.params._id);
			res.status(200).json({ succ:'Success!', file: updatedFile });
		} else {
			res.status(400).json({ errors });
		}
	}catch(err){
		console.error(err);
		res.status(500).json({ errors: err });
	}
});


app.delete('/folders/:parent_id/files/:_id', async (req, res) =>{
	try{
		const { parentId, id } = req.body;
		const fileWrapperToDeleteId = id || req.params._id;
		let query = { _id: parentId || req.params.parent_id};
		//Remove file and chunks from db and then fileWrapper
		let confirmRemove = await deleteFile(req.body.id);
		//Update rootFolder's filesChildren	
		let rootFolder = await Folder.findOne(query);
		const updatedFilesChildren = rootFolder._doc.filesChildren.filter(id => id != fileWrapperToDeleteId).map(id => id.toString());
		let confirmUpdate = await Folder.update(query, { $set: { filesChildren: updatedFilesChildren }});
		res.status(200).json('Success!');
	}catch(err){
		console.error(err);
		res.status(500).json({ errors: err });
	}
});

app.use((req, res) => {
    res.status(404).json({
        errors: {
            global: "Still working on it. Please try again later."
        }
    })
})



app.listen(config.port, () => console.log(`Server is running on localhost: ${config.port} `));