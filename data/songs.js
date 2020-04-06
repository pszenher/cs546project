const mongoCollections = require('../config/mongoCollections');
const songs = mongoCollections.songs;
// const users_db = mongoCollections.users;
// const users = require('./users');
const {ObjectId} = require('mongodb')

const id_check = async function(id){

    if (typeof id === "string"){
      // console.log("string")
        const objId = ObjectId.createFromHexString(id);
        return objId;
    }
    else{
      // console.log ("object")
        return id;
    }
  
}


const exportedMethods = {

    async getAllSongs() {
      
      const songCollection = await songs();
      
      songList = await songCollection.find({}).toArray();

      return songList;

    },

    async getSongById(id) {
      
        if (!id) throw 'You must provide a id of the album'
        if(typeof id != "string" && typeof id !="object") throw 'Input Album Id should be string or object'

        
        id = await id_check(id)
    
        const albumCollection = await albums();
        const album = await albumCollection.findOne({_id: id});
    
        if (!album) throw 'Album not found';

        return album;
    },
    
    async addAlbum(file, Title, genre, artistId, like_cnt, dislike_cnt) {
        if (!title) throw 'You must provide a title for the album'
        if (!songs) throw 'You must provide a array of songs from the albums'
        if (!bandId) throw 'You must provide a id of the band'
  
        if (typeof title !== 'string') throw 'Input of title of album should be string'; 
        if(typeof bandId != "string" && typeof bandId !="object"){
          throw 'Input Band Id should be string or object'
        }
        if (typeof songs != "object" && !Array.isArray(songs)) throw "Please provide the list of songs in Array"
        // console.log("1")
        bandId = await id_check(bandId)
        // console.log("2")
        const albumCollection = await albums();
        // console.log(bands.getAllBands);
        const bandWithAlbum = await bands.getBand(bandId);
    
        const newPost = {
          title: title,
          author: bandId,
          songs: songs,
        };
    
        const newInsertInformation = await albumCollection.insertOne(newPost);
        const newId = newInsertInformation.insertedId;
    
        await bands.addAlbumToBand(bandId, newId, title, songs);
    
        return await this.getAlbumById(newId);
      },
  



}