const model = require('../models/model');


//post request categories

 async function create_Categories(req,res){
   const Create = new model.Categories({
      type:"Inestment",
      color:'#FCBE44',
   })
   await Create.save(function (err) {
      if (!err) return res.json(Create);
      return res.status(400).json({ message: `Error while creating categories ${err}` });
    })

 }

 //get request categories
 async function get_Categories(req,res){
   let data = await model.Categories.find({})

   let filter = await data.map(v => Object.assign({}, { type: v.type, color: v.color }));
   return res.json(filter);

 }
// post  request transaction
 async function create_Transaction(req,res){
   if(!req.body)return res.status(400).json("post http data not provided");
   let {name,type,amount} =req.body;

   const create = new model.Transaction({
      name,
      type,
      amount,
      date: new Date()
   });

   create.save(function(err){
       if(!err)return res.json(create) ; 
      return res.status(400).json({message : `Error while creating Transaction ${err}`});
   })
 }
 //get request for transaction
 async function get_Transaction(req,res){
   let data = await model.Transaction.find({});
   return res.json(data);
 }
 //delete request 
 async function delete_Transaction(req,res){
   if(!req.body) res.status(400).json({message: "request body not found"});
   await model.Transaction.deleteOne(req.body,function(err){
      if(!err) res.json("Record deleted...!");

   }).clone().catch(function(err){res.json("Error while deleting transaction records")})
 }
 // get req 
 async function get_Labels(req,res){

   model.Transaction.aggregate([
      {
         $lookup:{
            from:'categories',
            localField:'type',
            foreignField:"type",
            as:'categories_info',
         }
      },
      {
         $unwind:'$categories_info'
      }
      
   ]).then(result =>{
      let data = result.map(v => Object.assign({},{ _id:v._id , name:v.name , type:v.type , amount:v.amount , color:v.categories_info['color']}));
      res.json(data);
   }).catch(error=>{
      res.status(400).json("lookup collection error");
   })
}
 module.exports={
   create_Categories,
   get_Categories,
   create_Transaction,
   get_Transaction,
   delete_Transaction,
   get_Labels


   
 }
