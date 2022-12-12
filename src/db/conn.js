const mongoose = require("mongoose");
mongoose
  .connect(
    process.env.MONGO_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true, 
    } 
  ) 
  .then(() => {
    console.log("Mongo db is connected properly");
  })
  .catch((err) => {
    console.log(err);
  });
