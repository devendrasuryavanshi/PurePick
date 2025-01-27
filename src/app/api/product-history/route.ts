import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db-connect";
import ProductInsight from "@/models/product-insight";

export async function GET(req: NextRequest) { // get all products
    try {
        const userId = req.headers.get('user-id');
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await connectDB();
        const products = await ProductInsight.find({ userId })
            .sort({ createdAt: -1 });
        return NextResponse.json({ products });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) { // update product
    try {
        const userId = req.headers.get('user-id');
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { productId, shared } = await req.json();
        await connectDB();

        const product = await ProductInsight.findOneAndUpdate(
            { _id: productId, userId },
            { shared },
            { new: true }
        );

        return NextResponse.json({ success: true, shared: product.shared });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) { // delete product
    try {
        const userId = req.headers.get('user-id');
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { productId } = await req.json();
        await connectDB();

        await ProductInsight.findOneAndUpdate(
            { _id: productId, userId },
            { $unset: { userId: "" }, shared: false },
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}