import express from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import { passUsers } from "./utils/constants.mjs";

const app = express();
const PORT = 5001;

// Middlewares
app.use(express.json());
// cookie-parser
// The secret is passed inside refering the secret needed to parse the cookie
app.use(cookieParser('123'))
/* 
    Sessions 
        It is used to store the data in the servers
        when the user loggs in the data like user.id and password is sent to server and 
        the session id of the data is stored in client's cookie and when relogss in the session id is extracted and autmatically 
        loggs in
*/
app.use(
  session({
    secret: 'jabezedu',         // this is to encrypt or decryt the data
    saveUninitialized: false,   // it does not create a session until data is inserted
    resave: false,              // it does not save resave changes
    cookie: {
      maxAge: 60000 * 2,

    }
  })
)
/*
    Here the route file is used to use it v have to use .use function which
    means it will use the routes in the router -> ./routes/users.mjs
    the first argument refers the route where the routes will land

*/
app.use(routes);


// Default Route
app.get("/", (req, res) => {
    console.log(req.session);
    console.log(req.session.id);
    req.session.visited = true;
    req.session.userId = 123;
    res.cookie('hello', 'world', {maxAge: 6000, signed: true});
    res.send("Hello World !");
});

app.post("/api/auth",(req, res) => {
    const {userName, password} = req.body;
    const findUser = passUsers.find((user) => user.userName == userName);
    if (!findUser || findUser.password != password) return res.status(401).json({msg: "Bad Credentials"});

    req.session.user = findUser;
    return res.status(200).send(findUser)
})

app.get("/api/auth/status", (req, res) => {
    if(!req.session.user) return res.status(400).send("No User Object")
    res.status(200).json({msg: "User exists", userId: req.session})
})


app.listen(PORT, () =>
  console.log(`Server has started at http://localhost:${PORT}`),
);


/*
    sessions
        by giving the basic schema the session is made
        when set a value of the element the id of that data gets stored to the cookie in the client
        eg
            1. req.session.userId = 'user1'
            2. it gets stored the encrypted id
                eg:
                    s%3AWk8IgC6PUDg8AW_1M8eVscEAim_i1SfT.auu43b9Zln6dydetGOK%2BO9W0%2FSztDrmFNkCiyQ8DBqA
            3. The data can be retrived as
                req.sessionStore.get(req.session.id, (err, data) => {
                    error hadnling
                    logs the data    
                })
                
*/