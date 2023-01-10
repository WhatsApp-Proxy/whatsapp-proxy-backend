import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const discoveryKeySchema = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    maxUsages: { type: Number, required: true },
    serverNamePrefix: { type: String, required: false },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: {
      currentTime: () => Date.now(),
    },
  }
);

type discoveryKeySchemaType = {
  _id: any;
  key: string;
  maxUsages: number;
  serverNamePrefix?: string;
  isActive: boolean;
};

export default mongoose.model('discoveryKey', discoveryKeySchema);
export { discoveryKeySchemaType };
