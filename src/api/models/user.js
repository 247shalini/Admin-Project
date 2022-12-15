const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstName: { type: Schema.Types.String, required: true },
    lastName: { type: Schema.Types.String, required: true },
    email: { type: Schema.Types.String, required: true },
    password: { type: Schema.Types.String, required: true },
    role: {
      type: String,
      enum: ["Super_admin", "Admin", "Student", "Teacher"],
      default: "Student",
    },
    status: { type: String, enum: ["Active", "Deactive"], default: "Active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
