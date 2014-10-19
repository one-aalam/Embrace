var email  = require('emailjs'),
        _ = require('lodash'),
        path = require('path'),
        isHtml = require('is-html'),
        path = require('path'),
        fs = require('fs'),
        templatr = require('email-templates'),
        consolidate = require('consolidate'),
        settings = require('../configuration'),
        tplDir = path.join(process.cwd(),'/','server', '/', 'templates'),
        upDir =  path.join(process.cwd(),'/','public', '/', 'uploads'),
        debug = require('../debug'),
        mime = require('mime'),
        templates = [];


var    server = email.server.connect({
       user:    "aftabbuddy",
       password:"get8mei9",
       host:    "smtp.gmail.com",
       ssl:     true
    });


var config = {
      from: 'Admin <admin@aalam.in>' ,
      to:'aftabbuddy@gmail.com, aftab@mobicules.com',
      text:'This must be working',
      cc:'aftab@mobicules.com',
      subject:'DEFAULT_SUBJECT',
      files:'',
      attachment:[]
}
//https://www.npmjs.org/package/email-templates


function _verify(mail){

}

function _process(mail){

}

function readTpls(){
  var inlined = path.join(tplDir,'/', 'inlined') ;
   try {
        files = fs.readdirSync(inlined);
    } catch (err) {
        throw err;
    }

    for (i = 0, len = files.length; i < len; ++i) {
        file = files[i];
        body = fs.readFileSync(path.join(inlined,'/',file), 'utf-8');
        templateName = file.substring(0, file.lastIndexOf('.'));
        templates[templateName] = body;
        debug("Load template '" + file + "'");
    }
}

readTpls(); // disable file based for now
// later allow both file and directory




exports.send = function(options, tpl){



  _.extend(config, options);

  if(config.files.length && config.attachment){
      config.files.forEach(function(file){
        config.attachment.push({path:path.join(upDir,'/',file), type:mime.lookup(file), name:file});
      });
  }
  delete config['files'];

  if(isHtml(config.text) || (typeof tpl === 'string' && config.data)){
    debug(templates[tpl]); // interpolate with config.data
    // check tpl existence
    // render tpl with data
    // email template based
    /* --------- EMAIL_TEMPLATE
    debug(templatr); debug('----');

    templatr(tplDir, function(err, templ){
      templ('newsletter', config.data, function(err, html, text){ console.log(err);
          debug(html); debug('----');
          config.attachment.push({data:html, alternative:true});

          server.send(config, function(err, message){
            console.log(err || message);
          });
      });
    });*/
    // this could alos be devised using 'consolidate' and 'juice'
    // All prepared HTML based
    // don't requires a templating engine
    // but requires totally prepared email template
    _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
    config.attachment.push({data:_.template(templates[tpl], config.data), alternative:true});

  }
    delete config['data'];
    server.send(config, function(err, message){
      console.log(err || message);
    });


}
