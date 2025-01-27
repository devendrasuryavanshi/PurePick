
import { ProductInsights } from "@/types/product.types";

export const canSendMsg = async (productId: string, ProductInsights: ProductInsights, userId: string) => {
    if(userId !== ProductInsights.userId.toString()) return false;
    const response = await fetch('/api/chat', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'productId': productId,
            'userId': userId,
        },
    });
    const data = await response.json();
    if(data.error) {
        return false;
    }

    return true;
}