import { Schema, model, models } from "mongoose";

const PrizeSchema = new Schema({
  name: {
    type: String,
    required: [true, "name is required."],
  },
});

const Prize = models.Prize || model("Prize", PrizeSchema);

export default Prize;
