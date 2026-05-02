import passport from "passport";
import {Strategy} from "passport-local"
import {passUsers} from "../utils/constants.mjs";

/*
    Statergy
        This is used to see how the login is handled
    It goes into 'local' statergy and then the code for the verification is done
    
    done()
        1. value : err
            if any err it should be passed here
        2. value : IDK
            Here I am passing the user found 

    once the login gets authenticated and verified the id IDK
    is stored in cookies 

    These accept only the userame if v have either email or phone number
    it is required to let know passport js to tell why and what
    so it is needed to pass
        {usernameField : "email"}, ()
    or 
        {usernameField : "phone"}
*/

/*
    passport.serializeUser()
        Responsible to store the session of the users
*/
passport.serializeUser((user, done) => {
    console.log('Inside Serialize user');
    console.log(user)
    done(null, user.id);
})

passport.deserializeUser((id, done) => {
    console.log('Inside Deserialize User');
    console.log(`Deserializing user ID : ${id}`);
    try {
        const findUser = passUsers.find((user) => user.id == id);
        if(!findUser) throw new Error("User Not Found")
        done(null, findUser );
    }catch(err){
        done(err, null)
    }
})


export default passport.use(
    new Strategy((username, password, done)  => {   
        console.log(`username: ${username} - password: ${password}`)
        try{
            const findUser = passUsers.find((user) => user.username == username)
            if (!findUser) throw new Error('User Not found')
            if (findUser.password !== password) throw new Error('Invalid Credentials');
            done(null, findUser)
        } catch (err) {
            done(err, null);
        }
    })
)