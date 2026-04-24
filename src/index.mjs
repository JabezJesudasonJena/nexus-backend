import express from 'express';

const app = express();
const PORT = 5001;


// Middlewares
app.use(express.json())
const mockUsers = [
    {id: 1, userName: "john", displayName: "John"},
    {id: 2, userName: "mark", displayName: "Mark"},
    {id: 3, userName: "mahesh", displayName: "Mahesh"},
]

app.get("/", (req,res) => {
    res.send("Hello World !")
})


// Request params
app.get("/api/users/:id", (req, res) => {
    const parsedId = parseInt(req.params.id);
    console.log(parsedId)
    if(isNaN(parsedId)) return res.status(400).send({msg : 'Bad request'})
    
    const finduser = mockUsers.find((user)=> user.id === parsedId)

    if(!finduser) return res.status(404).send({msg : "User Not found"});
    
    return res.send(finduser)
})

// Query String eg : localhost:5001/api/users?filter=userName&value=john
// It will return the user with userName john
app.get("/api/users", (req, res) => {
    console.log(req.query);
    const {
        query : {filter, value}
    } = req
    // when filter and value are undefined
    if(!filter && !value) {
        return res.send(mockUsers, {msg : "No filter, value in "})
    } 
    if (filter && value) return res.send(
        mockUsers.filter((user) => user[filter].includes(value))
    );
    res.send(mockUsers);
})

// Post request
app.post("/api/users", (req, res) => {  
    const newUser = {id: mockUsers[mockUsers.length - 1].id + 1, ...req.body}
    mockUsers.push(newUser);
    return res.status(201).json(newUser)
    // console.log(req.body)
    // return res.status(200).send(req.body)
})

app.listen(PORT, () => console.log(`Server has started at http://localhost:${PORT}`))


