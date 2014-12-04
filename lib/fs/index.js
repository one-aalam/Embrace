var fs = require('fs'),
	readDir = require('recursive-readdir'),
	delFile = require('del');

function read(file,cb, err){
	return function(cb, err){
		fs.readFile(file)(cb, function(error){
			if(error.errno === process.ENOENT){
				cb("");
			}else{
				err(error);
			}
		})
	};
}

function isFile(file, cb, err){

  fs.stat(filename)(function (stat) {
    cb(stat.isFile());
  }, err);

}

function dir(o, cb){
	readDir(o.path, o.filter, function (err, files) {
  // Files is an array of filename
  		cb(files);
	});
}


function flush(){

}

function del(o, cb){
	del(o.filter, function (err) {
    		cb();
	});
}