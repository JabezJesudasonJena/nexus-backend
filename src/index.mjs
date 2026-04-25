import express from "express";
import { query, validationResult, body, matchedData } from "express-validator";

const app = express();
const PORT = 5001;

// Middlewares
app.use(express.json());

const logginMiddlewaare = (req, res, next) => {
  console.log(`${req.method} - ${req.url}`);
  next();
};

const resolveIndexByUserId = (req, res, next) => {
  const {
    body,
    params: { id },
  } = req;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return res.sendStatus(400);
  const findUserIndex = mockUsers.findIndex((user) => user.id == parsedId);
  if (findUserIndex == -1) return res.sendStatus(400);
  req.findUserIndex = findUserIndex;
  next();
};

// Data
const mockUsers = [
  { id: 1, userName: "john", displayName: "John" },
  { id: 2, userName: "mark", displayName: "Mark" },
  { id: 3, userName: "mahesh", displayName: "Mahesh" },
];

app.get("/", (req, res) => {
  res.send("Hello World !");
});

// Api endpoint with middelware
app.get("/api/midd", logginMiddlewaare, (req, res) => {
  res.send("Hello World");
  console.log("Inside the main endpoint !");
});

//By using resolve middleware
app.get("/api/user/:id", resolveIndexByUserId, (req, res) => {
  const { findUserIndex } = req;
  console.log(findUserIndex);
  res.status(200).json({ user: mockUsers[findUserIndex] });
});

// Request params
app.get("/api/users/:id", (req, res) => {
  const parsedId = parseInt(req.params.id);
  console.log(parsedId);
  if (isNaN(parsedId)) return res.status(400).send({ msg: "Bad request" });

  const finduser = mockUsers.find((user) => user.id === parsedId);

  if (!finduser) return res.status(404).send({ msg: "User Not found" });

  return res.send(finduser);
});

// Query String eg : localhost:5001/api/users?filter=userName&value=john
// It will return the user with userName john
app.get(
  "/api/users",
  query("filter")
    .isString()
    .notEmpty()
    .withMessage("It must not be empty !")
    .isLength({ min: 3, max: 10 })
    .withMessage("Must be between 3 - 10 characters !"),
  (req, res) => {
    const result = validationResult(req);
    // Validation of the results
    console.log(result);
    const {
      query: { filter, value },
    } = req;
    // when filter and value are undefined
    if (!filter && !value) {
      return res.json({ users: mockUsers, msg: "No filter, value in queries" });
    }
    if (filter && value)
      return res.json(mockUsers.filter((user) => user[filter].includes(value)));
    res.json({ users: mockUsers });
  },
);

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
app.post(
    "/api/users",
    body('userName')
        .notEmpty().withMessage('UserName cannot be empty')
        .isLength({min: 5, max: 32}).withMessage('UserName must be 5 character with the max of 32 characters')
        .isString().withMessage('UserName must be in String'),
    body('displayName')
        .notEmpty().withMessage("The Display name should not be empty")
        .isLength({min: 4, max: 32}).withMessage('Display Name should be of 4 to 32 characters')
        .isString().withMessage('Display Name should be of a String'),
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

// Put request
// It is used to update only a portion of the data
app.put("/api/users/:id", (req, res) => {
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

// Patch request
// Used to update the partial portion of data
app.patch("/api/users/:id", (req, res) => {
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

// Delete request Method
app.delete("/api/users/:id", (req, res) => {
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

app.put("/api/users/put/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIndex } = req;
  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
  res.status(204).json({ msg: "user updated" });
});

app.listen(PORT, () =>
  console.log(`Server has started at http://localhost:${PORT}`),
);
