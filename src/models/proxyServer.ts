import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const proxyServerSchema = new Schema(
  {
    ipAddress: { type: String, required: true, unique: true, index: true },
    proxyPort: { type: Number, required: true },
    discoveryPort: { type: Number, required: false },
    serverName: { type: String, required: true, unique: true, index: true },
    country: { type: String, required: true },
    pendingDeletion: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'discoveryKey' },
  },
  {
    timestamps: {
      currentTime: () => Date.now(),
    },
  }
);

type proxyServerSchemaType = {
  _id?: any;
  ipAddress: string;
  proxyPort: number;
  discoveryPort?: number;
  serverName: string;
  country: string;
  pendingDeletion: boolean;
  createdBy?: any;
};

export default mongoose.model('proxyServer', proxyServerSchema);
export { proxyServerSchemaType };
