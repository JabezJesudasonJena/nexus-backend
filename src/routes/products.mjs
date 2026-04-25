import { Router } from "express";

const productsRouter = Router();

productsRouter.get("/api/products", (req, res) => {
    res.json({Product : "description "})
})


export default productsRouter