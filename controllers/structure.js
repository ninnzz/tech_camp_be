var structure
	, db = require(__dirname + "/../helpers/ndb")
	, dt = new Date();


structure = function(kiel){
	return {
		get : {
			index : function(req,res){
				var opt;

				req.get_args.id && (opt = {_id:req.get_args.id});

				db._instance().collection('structure',function(err,_collection) {
					if(err){ kiel.response(req, res, {data : err}, 500); return;}
					_collection.find(opt).toArray(function(err,data){
						if(err){ kiel.response(req, res, {data : err}, 500); return;}
						if(data.length === 0)
							kiel.response(req, res, {data:"Structure record not found."}, 404);
						kiel.response(req, res, {data:data}, 200);
						return;
					});
				});
			} , 
			comments : function(req,res) {
				var rqrd = ['structure_id']
					, rst;
				if(!(rst = kiel.utils.required_fields(rqrd,req.get_args)).stat){
					kiel.response(req, res, {data : "Missing fields ["+rst.field+']'}, 500);
					return;
				}
				db._instance().collection('comments',function(err,_collection) {
					if(err){ kiel.response(req, res, {data : err}, 500); return;}
					_collection.find({structure_id:req.get_args.structure_id}).toArray(function(err,data){
						if(err){ kiel.response(req, res, {data : err}, 500); return;}
						if(data.length === 0)
							kiel.response(req, res, {data:"Comments record not found."}, 404);
						kiel.response(req, res, {data:data}, 200);
						return;
					});
				});

			}
		},
		post : {
			index : function(req,res) {
				var rqrd = ['image','name','description']
					, rst
					, spost = {};
					// , id = kiel.utils.hash('structure'+dt.getTime()+kiel.utils.random());
				if(!(rst = kiel.utils.required_fields(rqrd,req.post_args)).stat){
					kiel.response(req, res, {data : "Missing fields ["+rst.field+']'}, 500);
					return;
				}

				spost['_id'] = kiel.utils.hash('structure'+dt.getTime()+kiel.utils.random());
				spost['image'] = req.post_args.image;
				spost['name'] = req.post_args.name;
				spost['description'] = req.post_args.description;
				spost['rating'] = 0;

				db._instance().collection('structure',function(err,_collection) {
					if(err){ kiel.response(req, res, {data : err}, 500); return;}
					_collection.insert(spost,function(err,inserted){
						if(err){ kiel.response(req, res, {data : err}, 500); return;}
						kiel.response(req, res, {data:inserted}, 200);
						return;
					});
				});	
			} ,
			comments : function(req,res) {
				var rqrd = ['image','comment','rating','structure_id']
					, rst
					, spost = {};
					// , id = kiel.utils.hash('structure'+dt.getTime()+kiel.utils.random());
				if(!(rst = kiel.utils.required_fields(rqrd,req.post_args)).stat){
					kiel.response(req, res, {data : "Missing fields ["+rst.field+']'}, 500);
					return;
				}

				spost['_id'] = kiel.utils.hash('structure'+dt.getTime()+kiel.utils.random());
				spost['image'] = req.post_args.image;
				spost['comment'] = req.post_args.comment;
				spost['structure_id'] = req.post_args.structure_id;
				spost['rating'] = req.post_args.rating;

				db._instance().collection('comments',function(err,_collection) {
					if(err){ kiel.response(req, res, {data : err}, 500); return;}
					_collection.insert(spost,function(err,inserted){
						if(err){ kiel.response(req, res, {data : err}, 500); return;}
					
						_collection.find({structure_id:req.post_args.structure_id},{rating:1}).toArray(function(err,c_data){
							if(err){ kiel.response(req, res, {data : err}, 500); return;}
							var s_rating = 0;
							for(var i in c_data) {
								s_rating += c_data[i].rating;
							}
							s_rating = s_rating/c_data.length;


							db._instance().collection('structure',function(err,s_collection) {
								if(err){ kiel.response(req, res, {data : err}, 500); return;}
								s_collection.update({_id:req.post_args.structure_id}, {'$set':{rating:s_rating}},function(er,updated) {
									if(er){ kiel.response(req, res, {data : err}, 500); return;}
									console.log(err);
									console.log(d);
									kiel.response(req, res, {data:"Success"}, 200);
									return;
								});
							});
						});
					});
				});	
			}
		}, 

		put : {
	
		},

		delete : {

		}
	}
}

module.exports = structure;
