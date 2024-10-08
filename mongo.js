
const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://anurag:Anurag@cluster1.zi76wot.mongodb.net/nobale")
    .then(() => {
        console.log("mongodb connected");
    })
    .catch(() => {
        console.log('failed');
    });
const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true
    }
});
const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
