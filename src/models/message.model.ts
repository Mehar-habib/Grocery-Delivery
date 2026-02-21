import mongoose, { Schema } from "mongoose";

export interface IMessage {
  _id?: mongoose.Types.ObjectId;
  roomId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  text: string;
  time: string;
  createdAt?: Date;
  updatedAt?: Date;
}
const messageSchema = new Schema<IMessage>(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    text: {
      type: String,
    },
    time: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema);
export default Message;

// roomId means orderId
