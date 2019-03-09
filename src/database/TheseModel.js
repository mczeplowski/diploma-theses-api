import { model, Schema } from 'mongoose';

const theseSchema = new Schema(
  {
    surname: String,
    name: String,
    topic: String,
    promoter: String,
    reviewer: String,
    studies: String,
    field: String,
    specialty: String,
    defenseDate: Date,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model('These', theseSchema);
