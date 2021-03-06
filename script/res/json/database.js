const Datastore = require('nedb');
const RESOURCE_DIR = `${__dirname}/../../../.resources/`;
const fs = require('fs');

class Database {
    constructor(){
        this.db = {};
    }
    loadDb(dbname){
        if(dbname in this.db){
            return this.db[dbname];
        }
        let datastore = new Datastore({ filename: `${RESOURCE_DIR}/db/${dbname}.json` , autoload : true});
        this.db[dbname] = datastore;
        return datastore;
    }
}

const database = new Proxy(new Database(),{
    get: function(target,key){
        if(key === 'isExist'){
            return function (dbName){
                return fs.existsSync(`${RESOURCE_DIR}/db/${dbName}.json`);
            }
        }
        return target.loadDb(key);
    },
    set: function(target,key,value){
        target[key] = value;
    }
});


module.exports = database;