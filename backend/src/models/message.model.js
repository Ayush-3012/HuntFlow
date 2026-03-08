import mongoose from "mongoose";

const coldMessageSchema = new mongoose.Schema({
    applicationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
        required: true,
    },
    message: {
        type: String,
        required: true,
        trim: true,
    }
}, { timestamps: true });


coldMessageSchema.index({ applicationId: 1, updatedAt: -1 });

export const ColdMessage = mongoose.model("ColdMessage", coldMessageSchema);

