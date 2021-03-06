const 
crypto = require('crypto'),
NodeCache = require( "node-cache" ),
Dropbox = require('dropbox').Dropbox,
fetch = require('isomorphic-fetch');
 
//Redirect URL to pass to Dropbox. Has to be whitelisted in Dropbox settings
const OAUTH_REDIRECT_URL="http://localhost:3000/auth";
 
//Dropbox configuration
const config = {
  fetch: fetch,
  clientId: process.env.DBX_APP_KEY,
  clientSecret: process.env.DBX_APP_SECRET
};
 
var dbx = new Dropbox(config);
var mycache = new NodeCache();

var authenticate = (req, res) => {
  let state = crypto.randomBytes(16).toString('hex');
    mycache.set(state, req.session.id, 6000);
    authUrl = dbx.getAuthenticationUrl(OAUTH_REDIRECT_URL, state, 'code');
    res.redirect(authUrl);
}

module.exports.file = async (req, res, next)=>{
  if(!req.session.token){
    authenticate(req, res);
  } else {
    dbx.setAccessToken(req.session.token);
    dbx.filesDownload({
      path: "/"+req.params.filename
    }).then( (data) => {
      console.log(data);
      res.send(data);
    }).catch((error) => {
      console.log(error);
    });
    dbx.setAccessToken(null); //clean up token
  }
}

module.exports.list = async (req, res, next)=>{
  if(!req.session.token){
    authenticate(req, res);
  } else {
    dbx.setAccessToken(req.session.token);
    dbx.filesListFolder({
      path: ''
    }).then( (data) => {
      console.log(data);
      res.json(data);
    }).catch((error) => {
      console.log(error);
    });
    dbx.setAccessToken(null); //clean up token
  }
}

module.exports.write = async (req, res, next)=>{
  if(!req.session.token){
    authenticate(req, res);
  } else {
    dbx.setAccessToken(req.session.token);
    dbx.filesUpload({
      path: `/${req.body.fileName.toString()}`,
      contents: req.body.fileContents,
      mode: {".tag": "overwrite"},
      autorename: false
    }).then( (data) => {
      console.log(data);
      res.json({ status: "success"});
    }).catch( (error) => {
      console.log(error);
    });
    dbx.setAccessToken(null); //clean up token
  }
}

module.exports.home = async (req, res, next)=>{
  if (!req.session.token){
    res.render('index');
  } else {
    dbx.setAccessToken(req.session.token);
    try{
      let account_details = await dbx.usersGetCurrentAccount();
      let display_name = account_details.name.display_name;
      let r = null;
      dbx.filesListFolder({path: ''})
        .then(function(response) {
          res.render('app');
        })
        .catch(function(error) {
          console.error(error);
        });
      dbx.setAccessToken(null); //clean up token
 
    }catch(error){
      dbx.setAccessToken(null);
      next(error);
    }
  }
}
 
module.exports.app = async (req, res, next)=>{
  if (!req.session.token){
    authenticate(req, res);
  } else {
    dbx.setAccessToken(req.session.token);
    try{
      let account_details = await dbx.usersGetCurrentAccount();
      let display_name = account_details.name.display_name;
      let r = null;
      dbx.filesListFolder({path: ''})
        .then(function(response) {
          res.render('app');
        })
        .catch(function(error) {
          console.error(error);
        });
      dbx.setAccessToken(null); //clean up token
 
    }catch(error){
      dbx.setAccessToken(null);
      next(error);
    }
  }
}
 
//Redirect from Dropbox
module.exports.auth = async(req, res, next)=>{
  if (req.query.error_description){
    return next( new Error(req.query.error_description));
  }
  let state = req.query.state;
  if (!mycache.get(state)){
    return next(new Error("session expired or invalid state"));
  }
  if(req.query.code){
    try{
      let token = await dbx.getAccessTokenFromCode(OAUTH_REDIRECT_URL, req.query.code);
      req.session.token = token;
      mycache.del(state);
      res.redirect('/'); 
    } catch(error){
      return next(error);
    }
  }
}