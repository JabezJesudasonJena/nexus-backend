import express from 'express';

const app = express();
const PORT = 5001;

const mockUsers = [
    {id: 1, userName: "john", displayName: "John"},
    {id: 2, userName: "mark", displayName: "Mark"},
    {id: 3, userName: "mahesh", displayName: "Mahesh"},
]

app.get("/", (req,res) => {
    res.send("Hello World !")
})

app.get("/api/users/:id", (req, res) => {
    const parsedId = parseInt(req.params.id);
    console.log(parsedId)
    if(isNaN(parsedId)) return res.status(400).send({msg : 'Bad request'})
    
    const finduser = mockUsers.find((user)=> user.id === parsedId)

    if(!finduser) return res.status(404).send({msg : "User Not found"});
    
    return res.send(finduser)
})

app.listen(PORT, () => console.log(`Server has started at http://localhost:${PORT}`))


