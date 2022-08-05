
function log(req, res, next){
    console.log("Logging...");

    //perform logging

    next(); // passes to next fucntion in pipeline
    //if you don't remember to call the next fucntion, the response will hang. 
}

module.exports = log;