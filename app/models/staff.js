import { Schema, model, models } from "mongoose";

const StaffSchema = new Schema({
  name: {
    type: String,
    required: [true, "name is required."],
  },
});

const Staff = models.Staff || model("Staff", StaffSchema);

export default Staff;
