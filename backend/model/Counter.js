import mongoose from "mongoose";

const CounterSchema = new mongoose.Schema({
    model: { type: String, required: true },
    sequence_value: { type: Number, default: 0 },
});

const Counter = mongoose.model("Counter", CounterSchema);

export default Counter;
