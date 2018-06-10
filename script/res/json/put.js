const database = require('./database');

module.exports = (req,res) => {
    try{
        const doc = req.body;
        console.log('updating '+JSON.stringify(doc));
        doc._lastUpdatedOn = new Date().getTime();
        const resource = req.params.resource;
        // first we need to get the yaml file and check if theres any validation here
        const db = database[resource];
        const id = req.params.id;
        delete doc._id;
        delete doc._createdOn;
        console.log('updating '+JSON.stringify(doc));
        db.update({_id:id},{$set : doc},{},(err,numReplaced) => {
            if(err){
                res.end(JSON.stringify({errorMessage:err.message}));
            }else{
                res.end(JSON.stringify({success:true},null,2));
            }
        });
    }catch(err){
        console.error(err);
    }

    
};