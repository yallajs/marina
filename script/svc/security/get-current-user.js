const fetch = require("node-fetch");
const {apiServer} = require("../../../config");
module.exports = async (req,res) => {
    try {
        const sessionId = req.cookies.sessionId || req.query.sessionId;
        let result = await fetch(`${apiServer}/v1/users?sessionId=${sessionId}`);
        let data = await result.json();
        res.end(JSON.stringify(data));
    }catch(err){
        console.error(err);
    }
};