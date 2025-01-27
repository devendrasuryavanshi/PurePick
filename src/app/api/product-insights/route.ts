import connectDB from "@/lib/db-connect";
import Admin from "@/models/admin-model";
import ProductInsight from "@/models/product-insight";
import User from "@/models/user-model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const productId = req.headers.get("productId");
        const userId = req.headers.get("userId");

        if (!productId) {
            return NextResponse.json({ error: "Product ID is required." }, { status: 400 });
        }

        await connectDB();
        const productInsight = await ProductInsight.findOne({ _id: productId }).populate('userIdCopy', 'age gender allergies diseases');

        if (!productInsight) {
            return NextResponse.json({ error: "Product insight not found" }, { status: 404 });
        }

        if (productInsight?.userId && userId && productInsight?.userId?.toString() === userId) {
            return NextResponse.json({ productInsight }, { status: 200 });
        }

        if (await Admin.findOne({ userId })) {
            return NextResponse.json({ productInsight }, { status: 200 });
        }

        // remove key chat and userIdCopy
        productInsight.chat = undefined;
        productInsight.userIdCopy = undefined;

        if (productInsight.shared) {
            return NextResponse.json({ productInsight }, { status: 200 });
        }

        return NextResponse.json({ error: "You are not authorized to view this product insight." }, { status: 403 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}