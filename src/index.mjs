import express from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";

const app = express();
const PORT = 5001;

// Middlewares
app.use(express.json());
// cookie-parser
// The secret is passed inside refering the secret needed to parse the cookie
app.use(cookieParser('123'))
/*
    Here the route file is used to use it v have to use .use function which
    means it will use the routes in the router -> ./routes/users.mjs
    the first argument refers the route where the routes will land

*/
app.use(routes);


// Default Route
app.get("/", (req, res) => {
  res.cookie('hello', 'world', {maxAge: 6000, signed: true});
  res.send("Hello World !");
});


app.listen(PORT, () =>
  console.log(`Server has started at http://localhost:${PORT}`),
);
