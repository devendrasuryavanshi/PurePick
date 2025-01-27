import mongoose, { Schema, Model } from 'mongoose';

interface IAdmin {
    userId: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

interface AdminModel extends Model<IAdmin> {
    addAdmin(userId: string, email: string): Promise<IAdmin>;
}

const adminSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

adminSchema.statics.addAdmin = async function(userId: string, email: string) {
    const count = await this.countDocuments();
    if (count >= 3) {
        throw new Error('Maximum admin limit reached');
    }
    return this.create({ userId, email });
};

const Admin = (mongoose.models.Admin || mongoose.model<IAdmin, AdminModel>('Admin', adminSchema)) as AdminModel;
export default Admin;
