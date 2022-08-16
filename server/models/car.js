var mongoose = require("mongoose");
var Schema = mongoose.Schema;

(carSchema = new Schema({
  color: String,
  model: String,
  make: String,
  regis_no: String,
  categ: String,
  user_id: Schema.ObjectId,
  is_delete: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
})),
  (car = mongoose.model("car", carSchema));

module.exports = car;
