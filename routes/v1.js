const express 			= require('express');
const router 			= express.Router();

const UserController 	= require('../controllers/user.controller');
const CompanyController = require('../controllers/company.controller');
const HomeController 	= require('../controllers/home.controller');

const custom 	        = require('./../middleware/custom');

const passport      	= require('passport');
const path              = require('path');
const acl = require('express-acl');

require('./../middleware/passport')(passport)


//acl for routing
acl.config({
  baseUrl: '/v1',
  defaultRole: 'guest',
  decodedObjectName: 'user',
  filename: 'nacl.json',
});

//router.use(acl.authorize)


/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({status:"success", message:"Parcel Pending API", data:{"version_number":"v1.0.0"}})
});

const unAuthResponse = function(err, user, info,next) {
  console.log(arguments);
  next();
}

// router.use(function(req,res,next){
//   //console.log(req);
//   return next();
// })

router.post(    '/users', [passport.authenticate('jwt', {session:false}),acl.authorize],     UserController.create);                                                    // C
router.get(     '/users/:id',           [passport.authenticate('jwt', {session:false}),acl.authorize], UserController.get);        // R
router.get(     '/users',           [passport.authenticate('jwt', {session:false}),acl.authorize], UserController.getAll);        // R
router.put(     '/users',           [passport.authenticate('jwt', {session:false}),acl.authorize], UserController.update);     // U
router.delete(  '/users/:id',           [passport.authenticate('jwt', {session:false}),acl.authorize], UserController.remove);     // D
router.post(    '/users/login',     UserController.login);

router.post(    '/companies',             [passport.authenticate('jwt', {session:false}),acl.authorize], CompanyController.create);                  // C
router.get(     '/companies',             [passport.authenticate('jwt', {session:false}),acl.authorize], CompanyController.getAll);                  // R

router.get(     '/companies/:company_id', [passport.authenticate('jwt', {session:false}),acl.authorize], custom.company, CompanyController.get);     // R
router.put(     '/companies/:company_id', [passport.authenticate('jwt', {session:false}),acl.authorize], custom.company, CompanyController.update);  // U
router.delete(  '/companies/:company_id', [passport.authenticate('jwt', {session:false}),acl.authorize], custom.company, CompanyController.remove);  // D






router.get('/dash', [passport.authenticate('jwt', {session:false}),acl.authorize],HomeController.Dashboard)


//********* API DOCUMENTATION **********
router.use('/docs/api.json',            express.static(path.join(__dirname, '/../public/v1/documentation/api.json')));
router.use('/docs',                     express.static(path.join(__dirname, '/../public/v1/documentation/dist')));
module.exports = router;
