import mongoose from 'mongoose';

const companySchema = mongoose.Schema({
  name: { type: String, required: true },
  baseCurrency: { type: String, required: true },
  country: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Company', companySchema);
