var app = require('express')(),
	multer = require('multer'),
    fs = require('fs'),
    db = require(__dirname + "/helpers/ndb");

app.use(require('body-parser')({uploadDir : '/var/tmp'}));
app.use(multer({dest:'/var/tmp/'}));
app.post('/upload', function (req, res, next) {
	var files = req.files.image,
		length,
		id = req.body.id,
		filename = '',
		count = 0;
	
	!(files instanceof Array) && (files = [files]);
	if (!files) return res.send(400, {message : 'Image is missing'});
	if (files.length === 0) return res.send(400, {message : '0 Image found'});
	if (!id) return res.send(400, {message : 'ID is missing'});

	length = files.length;

	console.dir(files);

	files.forEach(ravengwapo);

	function ravengwapo(file, index){
		file.name = index + '-' + file.name;
		filename += 'http://ec2-54-214-176-172.us-west-2.compute.amazonaws.com/uploads/' + file.name + ',';
		fs.readFile(file.path, function (err, data) {
			if(err) return next(err);
			fs.writeFile(__dirname + '/uploads/' + file.name, data, function (err) {
				if(err) return next(err);
				count++;
				if (count === files.length) {
					db._instance().collection('comments',function(err, _collection) {
						if(err) return next(err);
						_collection.update({_id : id}, {$set : {image : filename.substring(0, filename.length - 1)}}, function(err, updated){
							if (err) return next(err);
							res.send(200, {message : 'Upload successful'});
						});
					});
				}
			});
		});
	}
});

app.listen(8080);





var env = "development";
module.exports = process.env.DREAM_COV
  ? require('./lib-cov/kiel_auth')
  : require('./lib/kiel_auth');
