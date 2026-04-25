import { Router } from "express";
import { query, validationResult, body, matchedData, checkSchema } from "express-validator";
import { createUserValidationSchema} from '../utils/validationSchemas.mjs'
import { mockUsers } from "../utils/constants.mjs";
import { resolveIndexByUserId } from "../middlewares/middleware.mjs";

const router = Router();
/*
    Routing
        This is used to seperate the routes into different files 
        eg: 
            seperating users routes in userRoutes.mjs and productsRoutes.mjs
*/
// Get all users
router.get(
    "/api/users",
    query("filter").isString().notEmpty().withMessage("It must not be empty !").isLength({ min: 3, max: 10 }).withMessage("Must be between 3 - 10 characters !"),
    (req, res) => {
        const result = validationResult(req);
        // Logging of results
        console.log(result);
        const {
        query: { filter, value },
        } = req;
        // This will handle if filter && value is undefined
        if (!filter && !value) {
        return res.json({ users: mockUsers, msg: "No filter, value in queries" });
        }
        if (filter && value)
        return res.json(mockUsers.filter((user) => user[filter].includes(value)));
        res.json({ users: mockUsers });
});

// Get single user by body
router.get("/api/users/:id", resolveIndexByUserId,(req, res) => {
    const { findUserIndex } = req;
    console.log(findUserIndex);
    res.status(200).json({ user: mockUsers[findUserIndex] });
})

// Get single user by params
router.get("/api/users", (req, res) => {
    const parsedId = parseInt(req.params.id);
    if(isNaN(parsedId)) return res.status(400).json({msg: "Bad request"});
    const finduser = mockUsers.find((user) => user.id == parsedId);
    if (!finduser) return res.status(404).json({msg: "user not found"})
    return res.send(finduser);
})

// Post request
/* 
    Express validator
        By using the body from the request object 
        it is extracting the userName and checking for the conditions i have provided if anyone of the conditions does not satisfy
        the result will catch it 
        eg :
            Result {
                formatter: [Function: formatter],
                errors: [
                    {
                    type: 'field',
                    value: 'test',
                    msg: 'UserName must be 5 character with the max of 32 characters',
                    path: 'userName',
                    location: 'body'
                    }
                ]
            }
*/
router.post(
    "/api/users",
    /*
        checkSchema
            inside this v can pass a Schema where all the 
            methods and the checks has to be performed
            check ./utils/validationSchemas.mjs for reference
    */
    checkSchema(createUserValidationSchema),
    (req, res) => { 
        const result = validationResult(req);
        /*
            This will check that if there are no errors
            isEmptyy() checks that if the result has erorr or not if os it satisfies
            .array() it gets the validation results in array....
        */
        if(!result.isEmpty()){
            return res.status(400).json({result: result.array()})
        }
        const data = matchedData(req);
        console.log(data)
        // console.log(result) // logs the result
        const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data };
        mockUsers.push(newUser);
        return res.status(201).json(newUser);
});


router.put("/api/users/:id", resolveIndexByUserId, (req, res) => {
    const {body, findUserIndex} = req;
    mockUsers[findUserIndex] = {id: mockUsers[findUserIndex].id, ...body}
    res.status(204).json({msg: "User Update PUT"})
})

router.patch("/api/users/:id", resolveIndexByUserId, (req, res) => {
    const {body, findUserIndex} = req;
    mockUsers[findUserIndex] = {...mockUsers[findUserIndex], ...body}
    res.status(204).json({msg: "user updated PATCH"})
})

router.delete("/api/users/:id", resolveIndexByUserId, (req, res) => {
    const {findUserIndex} = req;
    mockUsers.splice(findUserIndex, 1);
    res.status(200).json({msg: "User Deleted DELTE"})
})



/*
  These all are mock requests
*/


// Patch request
// Used to update the partial portion of data
router.patch("/api/users/mock/:id", (req, res) => {
  const {
    body,
    params: { id },
  } = req;
  const parsedId = parseInt(id);
  if (isNaN(parsedId))
    return res.status(400).json({ msg: "id fault", id: parsedId });
  const findUserIndex = mockUsers.findIndex((user) => user.id == parsedId);
  if (findUserIndex == -1)
    return res.status(404).json({ msg: "The user does not exit" });
  // Here as in the patch request it makes the other values which r not passed in the body in the same but modifying add adding
  // and adding the value given in body
  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return res.sendStatus(204);
});

// Put request
// It is used to update only a portion of the data
router.put("/api/users/mock/:id", (req, res) => {
  // This will destructrize the req and extract body and id
  const {
    body,
    params: { id },
  } = req;
  // This will convert the id which is in string into int
  const parsedId = parseInt(id);
  // This will check that if the id is valid
  // eg error
  // passing PUT /api/users/done or PUT /api/users/stringvalue
  // This if will handle if any of the error above satisfies
  if (isNaN(parsedId)) {
    return res.sendStatus(400).send(parsedId);
  }
  // this will return the index of the data v r going to change
  const findUserIndex = mockUsers.findIndex((user) => user.id == parsedId);
  // To check weather the index is in the users database
  if (findUserIndex == -1) return res.sendStatus(404);
  // Here the data in the users is been edited and returned as 204 refering of succcess edit of the data
  mockUsers[findUserIndex] = { id: parsedId, ...body };
  return res.status(204).json(mockUsers[findUserIndex]);
});

// Delete request Method
router.delete("/api/users/mock/:id", (req, res) => {
  const {
    params: { id },
  } = req;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return res.statusCode(400);
  const findUserIndex = mockUsers.findIndex((user) => user.id == parsedId);
  if (findUserIndex == -1)
    return res.status(404).json({ msg: "User Not found !" });
  // This splice is the function used to delete the value as the integer 1 refers to the deleteCount
  // If the delete cound not specified then it will del all the records after findUserIndex
  mockUsers.splice(findUserIndex, 1);
  return res.sendStatus(200);
});


export default router;