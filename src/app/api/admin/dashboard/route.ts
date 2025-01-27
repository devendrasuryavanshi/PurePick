import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db-connect";
import User from "@/models/user-model";
import Admin from "@/models/admin-model";
import ProductInsight from "@/models/product-insight";

export async function GET(req: NextRequest) { // get all products
    try {
        await connectDB();
        const userId = req.headers.get('user-id');
        const isAdmin = await Admin.findOne({ userId });

        if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const products = await ProductInsight.find({})
            .select('productDetails images overall eco_rating user alternatives shared userId userIdCopy createdAt')
            .populate('userIdCopy', 'firstName email')
            .sort({ createdAt: -1 });


        const admins = await Admin.find({}).select('userId email');

        const stats = {
            totalProducts: await ProductInsight.countDocuments(),
            totalUsers: await User.countDocuments(),
            sharedProducts: await ProductInsight.countDocuments({ shared: true }),
        };

        return NextResponse.json({ products, stats, admins });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) { // add admin
    try {
        const requesterEmail = req.headers.get('user-email');

        await connectDB();
        const isAdmin = await Admin.findOne({ email: requesterEmail });
        if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        let { adminEmail } = await req.json();
        adminEmail = adminEmail.trim();
        const user = await User.findOne({ email: adminEmail });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });


        if (await Admin.findOne({ userId: user._id })) return NextResponse.json({ error: "User is already an admin" }, { status: 400 });
        await Admin.addAdmin(user._id, user.email);

        const admin = await Admin.findOne({ userId: user._id });
        return NextResponse.json({ success: true, admin });
    } catch (error: any) {
        return NextResponse.json({ error: error }, { status: 400 });
    }
}

export async function DELETE(req: NextRequest) { // remove admin
    try {
        const requesterId = req.headers.get('user-id');
        const isAdmin = await Admin.findOne({ userId: requesterId });
        if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { adminUserId } = await req.json();
        if (adminUserId && (await User.findById(adminUserId))?.email === 'devendrasooryavanshee@gmail.com') {
            return NextResponse.json({ error: "You cannot remove this admin" }, { status: 400 });
        }
        if (adminUserId === requesterId) {
            return NextResponse.json({ error: "Cannot remove yourself" }, { status: 400 });
        }

        await Admin.findOneAndDelete({ userId: adminUserId });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 400 });
    }
}