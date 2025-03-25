const mongodb=require('mongoose')
const databaseDb=async()=>{
    await mongodb.connect("mongodb+srv://krishnendumaity2110:bopJ0KapTPT94Iy8@cluster0.jxxop.mongodb.net/DevTinder")
}

module.exports=databaseDb;

