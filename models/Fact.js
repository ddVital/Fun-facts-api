const mongoose = require("mongoose");

const FactSchema = mongoose.Schema(
  {
    fact: {
      type: String,
      required: true,
    },
    category: {
      type: Array,
      required: true,
    },
    lang: {
      type: String,
      required: true,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("Facts", FactSchema);
