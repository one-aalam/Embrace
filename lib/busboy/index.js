var path = require('path'),
    uuid = require('uuid'),
    fs = require('fs'),
    mkdirp = require('mkdirp'),
    os = require('os'),
    progress = require('progress-stream');

exports.ff = function(options){

  var _allowed = ['.jpg', '.jpeg', '.png'],
      saving = 0,
      done = false;

  return function(req, res, next){

        req.files = req.files || {};
        req.body = req.body || {};

        var checkUpload = req.method === 'POST',
            uploadDir = options.dir || os.tmpDir(),
            _tmpFile = '',
            _ext = '';

        if(!req.busboy || options.upload === false){
          return next();
        }
        if(checkUpload){

          req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype){
               ++saving;
              //var out = path.join(options.path, '/', uuid.v4(), '/', fieldname, filename);
              //tempFile = path.join(os.tmpDir(), path.basename(fieldname)+fileExtenstion);
                    _tmpFile = path.join(uploadDir,'/', filename);
                    _ext = path.extname(filename).toLowerCase();

                    mkdirp.sync(path.dirname(_tmpFile));



                    var writer = fs.createWriteStream(_tmpFile);

                    var str = progress({});
                    str.on('progress', function(progress){
                       console.log(progress);
                    });
                    file.pipe(str).pipe(writer);
                    file.on('conviction', function onLength(actual){ console.log('actual:' + actual);
                      str.setLength(actual);
                    });
                    writer.on('finish', function(){
                      console.log('uploaded sucessfully');
                        // also assign request files
                        /*
                        --saving;
                        if (done && saving === 0) {
                            next();
                        }*/
                    });
                    var file = {
                        field: fieldname,
                        file: _tmpFile,
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
            if(_allowed.length > 0){
               if(_allowed.indexOf(_ext) == -1) {
                     console.log({message: 'extension_not_allowed'});
                  //callback({message: 'extension_not_allowed'}, tempFile, formPayload);
                } else {
                  //callback(null, _tmpFile, formPayload)
                }
            } else {
              //callback(null, _tmpFile, formPayload)
            }
            next();
        });
        /*
        req.busboy.on('end', function() {
            done = true;
            if (done && saving === 0) {
                next();
            }
        });*/
        return req.pipe(req.busboy);
  };
};
