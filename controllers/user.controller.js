const { User }          = require('../models');
const authService       = require('../services/auth.service');
const { to, ReE, ReS }  = require('../services/util.service');

const create = async function(req, res){
    const body = req.body;

    if(!body.unique_key && !body.email && !body.phone){
        return ReE(res, 'Please enter an email or phone number to register.');
    } else if(!body.password){
        return ReE(res, 'Please enter a password to register.');
    }else{
        let err, user;

        [err, user] = await to(authService.createUser(body));

        console.log(user);
        if(err) return ReE(res, err, 422);

        let {id,email} = user; //@todo - change required fields
        return ReS(res, {message:'Successfully created new user.', user: {id,email}, token:user.getJWT()}, 201);
    }
}
module.exports.create = create;

const get = async function(req, res,info){
    let user = req.user;
    let id = req.params.id;

    [err, users] = await to(User.findById(id));

    if(err){
        //if(err.message=='Validation error') err = 'The email address or phone number is already in use';
        return ReE(res, err);
    }

    return ReS(res, {
        users //user.toWeb()
    });


    // return ReS(res, {
    //     user: user.toWeb()
    // });
}
module.exports.get = get;

const getAll = async function(req, res,info){
    let user = req.user;

    [err, users] = await to(User.findAll(
        {
            attributes: ['id', 'email', 'first', 'last','phone']
        }
    ));

    if(err){
        //if(err.message=='Validation error') err = 'The email address or phone number is already in use';
        return ReE(res, err);
    }

    return ReS(res, {
        users //user.toWeb()
    });
}
module.exports.getAll = getAll;


const update = async function(req, res){
    let err, user, data
    user = req.user;
    data = req.body;
    user.set(data);

    [err, user] = await to(user.save());
    if(err){
        if(err.message=='Validation error') err = 'The email address or phone number is already in use';
        return ReE(res, err);
    }
    return ReS(res, {message :'Updated User: '+user.email});
}
module.exports.update = update;

const remove = async function(req, res){
    let user, err, id = req.params.id, info;
    user = req.user;

    if(!id) return ReE(res, 'Id is missing!')
    
    //console.log(id)
    try {
        [err, info] = await to(User.destroy({
            "where" : {
                id : id
            }
        }
    ));
    } catch (error) {
        return res.send(error);
    }
    
    //console.log("count",info)
    if(err) return ReE(res, 'error occured trying to delete user');

    return ReS(res, {message:'Deleted User', count: info}, 200);
}
module.exports.remove = remove;


const login = async function(req, res){
    const body = req.body;
    let err, user;
    
    [err, user] = await to(authService.authUser(req.body));
    if(err) return ReE(res, err, 422);

    return ReS(res, {token:user.getJWT(), user:user.toWeb()});
}
module.exports.login = login;