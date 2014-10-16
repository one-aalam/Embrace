var path = require('path'),
    uuid = require('uuid'),
    fs = require('fs'),
    mkdirp = require('mkdirp'),
    os = require('os');

exports.ff = function(options){

  return function(req, res, next){
        req.files = req.files || {};
        req.body = req.body || {};

        var checkUpload = req.method === 'POST',
            uploadDir = options.dir || os.tmpDir();

        if(!req.busboy || options.upload === false){
          return next();
        }
        if(checkUpload){

          req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype){
              //var out = path.join(options.path, '/', uuid.v4(), '/', fieldname, filename);
                    var out = path.join(uploadDir,'/', filename);
                    mkdirp.sync(path.dirname(out));
                    var writer = fs.createWriteStream(out);
                    file.pipe(writer);
                    var file = {
                        field: fieldname,
                        file: out,
                        filename: filename,
                        encoding: encoding,
                        mimetype: mimetype
                    };
                    req.files[fieldname] = file;
          });
        }

        req.busboy.on('field', function(fieldname, val) {
            req.body[fieldname] = val;
        });
        req.busboy.on('finish', function() {
            next();
        });
        req.pipe(req.busboy);
  };
};

/*

if(req.method === 'POST'){

   var saving = 0,
   done = false,
   busboy = new Busboy({ headers: req.headers });

   req.files  = req.files || {};
   req.body   = req.body  || {};

   function saveFile(file){
     var saveTo = path.join(os.tmpDir(), path.basename(fieldname));

     file.pipe(fs.createWriteStream(saveTo));
   }

   busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {

       ++saving;
       saveFile(file, function (tempPath) {

           req.files[fieldname] = {
               path: tempPath,
               name: path.basename(filename)
           };

           --saving;
           if (done && saving === 0) {
               next();
           }
       });
   });

   busboy.on('field', function(fieldname, val, valTruncated, keyTruncated) {
       req.body[fieldname] = val;
   });

   busboy.on('end', function() {
       done = true;
       if (done && saving === 0) {
           next();
       }
   });
return req.pipe(busboy);
}else{
next();
}*/
