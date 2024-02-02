import mongoose from 'mongoose'

const conn=async()=>{
   try {
     await mongoose.connect(`${process.env.DATABASE_URL}`);
     console.log("database connection successfully")
   } catch (error) {
    console.error("databse connection error:",error)
   }
};

export default conn