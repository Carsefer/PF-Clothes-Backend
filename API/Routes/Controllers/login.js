const {profile,Op} = require('../../DataBase/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signIn = async (req,res) => {
    const {username, password } = req.body;

    const user = await profile.findOne({
        where:{ name:username }
    });

    const passwordCorrect = user === null ? false : await bcrypt.compare(password,user.password);

    try{
        if(!(user && passwordCorrect)){
            res.status(401).json({
                error:"invalid user or password",
            })
        }else{
            const userDataforToken = {
                id:user.id,
                username:user.name
            }
        
            const token = jwt.sign(userDataforToken,process.env.SECRET);

            res.send({
                username:user.name,
                token,
            });
        }
    }catch(err){
        res.send(err.message);
    }

};

module.exports = {
    signIn,
}