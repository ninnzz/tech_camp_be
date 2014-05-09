var transactions
	, db = require(__dirname + "/../helpers/ndb")
	, dt = new Date();


transactions = function(kiel){
	return {
		get : {
			index : function(req,res){
				var rqrd = ['id']
					, rst;
				if(!(rst = kiel.utils.required_fields(rqrd,req.get_args)).stat){
					kiel.response(req, res, {data : "Missing fields ["+rst.field+']'}, 500);
					return;
				}
				db._instance().collection('transactions',function(err,_collection) {
					if(err){ kiel.response(req, res, {data : err}, 500); return;}
					_collection.find({_id:req.get_args.id}).toArray(function(err,data){
						if(err){ kiel.response(req, res, {data : err}, 500); return;}
						kiel.response(req, res, {data:data}, 200);
						return;
					});
				});
			}
		},

		post : {
			index : function(req,res) {
				var rqrd = ['data']
					, rst
					, id = kiel.utils.hash('transactions'+dt.getTime()+kiel.utils.random());
				if(!(rst = kiel.utils.required_fields(rqrd,req.post_args)).stat){
					kiel.response(req, res, {data : "Missing fields ["+rst.field+']'}, 500);
					return;
				}
				db._instance().collection('transactions',function(err,_collection) {
					if(err){ kiel.response(req, res, {data : err}, 500); return;}
					_collection.insert({_id:id,value:req.post_args.data},function(err,inserted){
						if(err){ kiel.response(req, res, {data : err}, 500); return;}
						kiel.response(req, res, {data:inserted}, 200);
						return;
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

module.exports = transactions;
