const GenreModel = require('../Models/GenreModel')


module.exports.get = async (req,res)=>{


   const genres= await GenreModel.find()
//    console.log(await GenreModel.find())
   res.send(genres)
}

module.exports.save = async (req,res) =>{
    const {name} = req.body
    GenreModel
    .create({name})
    .then((data)=>{
        console.log("Genre has been successfully added...")
        console.log(data)
        res.send(data)
    })
}
module.exports.delete = async (req,res) =>{
    const {_id,name} = req.body
    GenreModel
    .findByIdAndDelete(_id)
    .then(()=>{res.status(201).send("Genre deleted sucessfully...")})
    .catch((err)=>{
            console.log(`Error while deleting ${name} Category :${err}`)
    })
    
}
module.exports.update = async (req,res) =>{

   
    
}
module.exports.findone = async (req,res) =>{
    const { name, id } = req.params;
    console.log(name, id);

   
    try {
        const Genrename= await GenreModel.findOne({name:name})
        console.log(Genrename)
        const genre = await GenreModel.findById({
            _id:id

        });
        console.log(genre);
        if (!genre) {
            res.status(404).json({ error: 'Genre not found' });
        } else {
            res.send(genre);
        }
        } catch (err) {
        return res.status(500).json({ err: 'Internal server error' });
        }

    
}