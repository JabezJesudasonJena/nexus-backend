import passport from "passport";
import {Strategy} from "passport-local"
import {  passUsers } from "../utils/constants.mjs";

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