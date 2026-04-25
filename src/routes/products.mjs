import { Router } from "express";

const productsRouter = Router();

productsRouter.get("/api/products", (req, res) => {
    //console.log(req.headers.cookie.hello);
    /*
        cookie-parser
        This is used to parse the cookie meaning the cookie will be returned in a proper format
        eg:
            without cookie-parser
                res: hello=world
            with cookie-parser
                res: {hello: 'world'}
        Cookies can be accesed from . as they are set/json/dictinoary values
        to validate the cookie it is nessacary to use signedCookies instead of normal cookies
    */
    console.log(req.cookies)
    console.log(req.signedCookies.hello)
    if(req.signedCookies.hello && req.signedCookies.hello == 'world') return res.json({Product : "description "})
    res.status(404).send("Sorry you need cookies")
})


export default productsRouter