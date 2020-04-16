const express = require("express");
const router = express.Router();
const data = require("../data");
const userData = data.users;

async function convertStringToInterestedArray(str){
  // very quickly thrown together for testing purposes
  let arr = [str];
  return arr;
}

router.get("/new", async (req,res) => {
  try {
    res.render('users/new');
  } catch (e) {
    res.status(500).json({error: e.message});
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await userData.getUserById(req.params.id);
    res.render('users/single',{user:user});
    //res.json(user);
  } catch (e) {
      res.status(404).json( { error: "User not found" } );
    }
    
});
router.get("/", async (req, res) => {
    try {
      const userList = await userData.getAllUsers();
      res.render('users/index',{users:userList});
      //res.json(userList);
    } catch (e) {
      // Something went wrong with the server!
      res.status(500).send( {error: e} );
    }
  });
router.post("/", async (req, res) => {
    const userPostData = req.body;

    try {
      let {firstName, lastName, email, gender, city, state, age, password,bio,interested } = userPostData; 
      interested = await convertStringToInterestedArray(interested);
      if( firstName && lastName && email &&  gender && city && state && age && password&& bio && Array.isArray(interested) ) {
        const newUser = await userData.addUser(firstName, lastName, email, gender, city, state, age, password,bio,interested)
        res.json(newUser);
      } else {
        res.status(400).send({ error: "Bad Request" });
      }

    } catch (e ) {
      res.status(500).send( { error: e } );
      console.log(e);
    }
  
});
router.patch("/:id", async (req, res) => {
  const userPostData = req.body;
  let idFound = await ifUserPresent(req.params.id);
  if(!idFound){ 
    res.status(404).send({ error: "Id not Found Request" }); 
    return
  }
  try {
    const {firstName, lastName, email, gender, city, state, age, password,bio,interested } = userPostData; 
    const updatedUser =  await userData.updateUser(req.params.id,firstName, lastName, email, gender, city, state, age, password,bio,interested)
    res.json(updatedUser)
  } catch (e ) {
    res.status(500).send( { error: e } );
    console.log(e);
  }
});


router.post("/addSongToPlaylist", async (req, res) => {

    const userPostData = req.body;    
    try {
      const {id, songId } = userPostData; 
      let idFound = await ifUserPresent(id);

      if(!idFound) {
        res.status(404).send({error: "User not found"});
        return
      }
      if( id && songId ) {
        const user =  await userData.addSongToPlaylist(id, songId)
        res.json(user)
      } else {
        res.status(400).send({ error: "Bad Request" });
      }

    } catch (e ) {
      res.status(500).send( { error: e } );
      console.log(e);
    }
  
});
router.post("/removeSongFromPlaylist", async (req, res) => {

    const userPostData = req.body;    
    try {
      const {id, songId } = userPostData; 
      let idFound = await ifUserPresent(id);

      if(!idFound) {
        res.status(404).send({error: "User not found"});
        return
      }
      if( id && songId ) {
        const user =  await userData.removeSongFromPlaylist(id, songId)
        res.json(user)
      } else {
        res.status(400).send({ error: "Bad Request" });
      }

    } catch (e ) {
      res.status(500).send( { error: e } );
      console.log(e);
    }
  
});
router.post("/addLikedSong", async (req, res) => {

    const userPostData = req.body;    
    try {
      const {id, songId } = userPostData; 
      let idFound = await ifUserPresent(id);

      if(!idFound) {
        res.status(404).send({error: "User not found"});
        return
      }
      if( id && songId ) {
        const user =  await userData.addLikedSong(id, songId)
        res.json(user)
      } else {
        res.status(400).send({ error: "Bad Request" });
      }

    } catch (e ) {
      res.status(500).send( { error: e } );
      console.log(e);
    }
  
});
router.post("/removeLikedSong", async (req, res) => {

    const userPostData = req.body;    
    try {
      const {id, songId } = userPostData; 
      let idFound = await ifUserPresent(id);

      if(!idFound) {
        res.status(404).send({error: "User not found"});
        return
      }
      if( id && songId ) {
        const user =  await userData.removeLikedSong(id, songId)
        res.json(user)
      } else {
        res.status(400).send({ error: "Bad Request" });
      }

    } catch (e ) {
      res.status(500).send( { error: e } );
      console.log(e);
    }
  
});



router.post("/addDisLikedSong", async (req, res) => {

    const userPostData = req.body;    
    try {
      const {id, songId } = userPostData; 
      let idFound = await ifUserPresent(id);

      if(!idFound) {
        res.status(404).send({error: "User not found"});
        return
      }
      if( id && songId ) {
        const user =  await userData.addDisLikedSong(id, songId)
        res.json(user)
      } else {
        res.status(400).send({ error: "Bad Request" });
      }

    } catch (e ) {
      res.status(500).send( { error: e } );
      console.log(e);
    }
  
});
router.post("/removeDisLikedSong", async (req, res) => {

    const userPostData = req.body;    
    try {
      const {id, songId } = userPostData; 
      let idFound = await ifUserPresent(id);

      if(!idFound) {
        res.status(404).send({error: "User not found"});
        return
      }
      if( id && songId ) {
        const user =  await userData.removeDisLikedSong(id, songId)
        res.json(user)
      } else {
        res.status(400).send({ error: "Bad Request" });
      }

    } catch (e ) {
      res.status(500).send( { error: e } );
      console.log(e);
    }
  
});

router.post("/addSongToUser", async (req, res) => {

    const userPostData = req.body;    
    try {
      const {id, songId } = userPostData; 
      let idFound = await ifUserPresent(id);

      if(!idFound) {
        res.status(404).send({error: "User not found"});
        return
      }
      if( id && songId ) {
        const user =  await userData.addSongToUser(id, songId)
        res.json(user)
      } else {
        res.status(400).send({ error: "Bad Request" });
      }

    } catch (e ) {
      res.status(500).send( { error: e } );
      console.log(e);
    }
  
});
router.post("/removeSongFromUser", async (req, res) => {

    const userPostData = req.body;    
    try {
      const {id, songId } = userPostData; 
      let idFound = await ifUserPresent(id);

      if(!idFound) {
        res.status(404).send({error: "User not found"});
        return
      }
      if( id && songId ) {
        const user =  await userData.removeSongFromUser(id, songId)
        res.json(user)
      } else {
        res.status(400).send({ error: "Bad Request" });
      }

    } catch (e ) {
      res.status(500).send( { error: e } );
      console.log(e);
    }
  
});

router.post("/updatePassword", async (req, res) => {

    const userPostData = req.body;
    
    try {
      const {id, password } = userPostData; 
      let idFound = await ifUserPresent(id);
      if(!idFound) {
        res.status(404).send({error: "User not found"});
        return
      }
      if( id && password ) {
        const userPassword =  await userData.updatePassword(id, password)
        res.json(userPassword)
      } else {
        res.status(400).send({ error: "Bad Request" });
      }

    } catch (e ) {
      res.status(500).send( { error: e } );
      console.log(e);
    }
  
});
router.delete("/:id",async (req, res) => {
    let idFound = await ifUserPresent(req.params.id);
    if( idFound ){
      try {          
        const deletedUser =  await userData.removeUser(req.params.id)        
        res.json(deletedUser)
      } catch(e){
        res.status(500).send({error: e});
      }
    }else{
        res.status(404).send({error: "User not found"});
    }
  });

module.exports = router;

async function ifUserPresent(id) {
    try {
        user = await userData.getUserById(id);
        return true
    }
    catch (e) {
        return false;
    }
    
}
