const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;

// Example users with different IDs
const users = [{
    id: "1",
    username: "Mhesh",
    password: "mhesh",
    isAdmin: true
}, {
    id: "2", // Changed ID to make sure it's unique
    username: "hesh",
    password: "hesh",
    isAdmin: false
}];

//middlewre
const verifyyUser =function(req,res,next){
    const userToken = req.headers.authorization
    if(userToken){
        const token =userToken.split(" ")[1]
        jwt.verify(token,'your-secret-key',function(err,user){
            if(err){
                return res.status(403).json({err:"Token is not valid"})
            }
            req.user=user
            next()
        })
    }
    else{
        res.status(401).json("You are not authenticate ")
    }
}

app.use(express.json());

// POST route for login
app.post('/api/login', (req, res) => { // Fixed route path
    const { username, password } = req.body;
    const user = users.find(function (person) {
        return person.username === username && person.password === password; // Fixed typos
    });

    if (user) {
        // You can generate a JWT token here if needed
        //Using sign method we convert into token to given body in sign method 
        const token = jwt.sign({ id: user.id, username: user.username,isAdmin:user.isAdmin }, 'your-secret-key', { expiresIn: '1h' });
        res.json({ token, user }); // Sending token and user data in response
    } else {
        res.status(401).json("User credentials don't match");
    }
});

app.delete('/api/users/:userId',verifyyUser,function(req,res){
    if(req.user.id === req.params.userId || req.user.isAdmin){
        res.status(200).json("user is deleted successfully ")
    }else{
        res.status(401).json("You re not llowed to delete ")
    }
})
app.listen(PORT, () => {
    console.log(`Server started and running @ ${PORT}`);
});
