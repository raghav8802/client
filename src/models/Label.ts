import mongoose, { Schema, Document } from "mongoose";

export interface iLabel extends Document {
    username: string;
    email: string;
    contact: string; // Changed to String
    razor_contact: string;
    password: string;
    usertype: string;
    verifyCode: string;
    verifyCodeExpiry: Date | null;
    isVerified: boolean;
    isLable: boolean;
    lable: string;
    joinedAt: Date;
    subscriptionEndDate: Date;
}

const LabelSchema: Schema<iLabel> = new Schema({

    username: {
        type: String,
        required: [true, 'Username required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email required'],
        trim: true,
        unique: true,
        match: [/.+\@.+\..+/, "Please use a valid email address"]
    },

    contact: {
        type: String, // Changed from Number to String
        required: [true, 'Number required'],
        trim: true,
        unique: true,
        match: [/^(\+?\d{1,4}[\s.-]?)?(\(?\d{3}\)?[\s.-]?)?[\d\s.-]{7,10}$/, "Please use a valid Contact address"]
    },

    razor_contact: {
        type: String,
        required: [true, 'razor_contact_id'],
        trim: true,
        unique: true,
    },

    password: {
        type: String,
        required: [true, 'Password required'],
        trim: true,
    },
    usertype: {
        type: String,
        enum: ['normal', 'super'],
        default: 'super'
    },
    verifyCode: {
        type: String,
        default: undefined
    },
    verifyCodeExpiry: {
        type: Date || null,
        default: undefined
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isLable: {
        type: Boolean,
        default: false
    },
    lable: {
        type: String,
        default: null
    },
    joinedAt: {
        type: Date,
        default: Date.now
    },
    subscriptionEndDate: {
        type: Date,
        default: Date.now
    }
});

const Label = (mongoose.models.Labels as mongoose.Model<iLabel>) || mongoose.model<iLabel>("Labels", LabelSchema);

export default Label;
