const getRatingColorClass = (rating: number) => {
    switch (rating) {
        case 0: return "bg-red-700/20 text-red-700";
        case 1: return "bg-red-600/20 text-red-600";
        case 2: return "bg-red-500/20 text-red-500";
        case 3: return "bg-orange-600/20 text-orange-600";
        case 4: return "bg-orange-500/20 text-orange-500";
        case 5: return "bg-yellow-500/20 text-yellow-500";
        case 6: return "bg-[#c4cb08]/20 text-[#c4cb08]";
        case 7: return "bg-[#a7cb08]/20 text-[#a7cb08]";
        case 8: return "bg-lime-500/20 text-lime-500";
        case 9: return "bg-green-600/20 text-green-600";
        case 10: return "bg-green-500/20 text-green-500";
        default: return "bg-neutral-500/20 text-neutral-500";
    }
};

const getBadgeClass = (rating: number) => {
    switch (rating) {
        case 0: return "bg-red-700";
        case 1: return "bg-red-600";
        case 2: return "bg-red-500";
        case 3: return "bg-orange-600";
        case 4: return "bg-orange-500";
        case 5: return "bg-yellow-500";
        case 6: return "bg-[#c4cb08]";
        case 7: return "bg-[#a7cb08]";
        case 8: return "bg-lime-700";
        case 9: return "bg-green-700";
        case 10: return "bg-green-500";
        default: return "bg-neutral-500";
    }
};

const getExpiryStatus = (expiryDate: string) => {
    if (!expiryDate) return { text: "No Expiry Info", style: "bg-neutral-500/20 text-neutral-500" };

    const expiry = new Date(expiryDate);
    const now = new Date();

    if (expiry < now) {
        return { text: "Expired", style: "bg-red-500/20 text-red-500" };
    }

    const daysLeft = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 3600 * 24));
    if (daysLeft <= 30) {
        return { text: `Expires in ${daysLeft} days`, style: "bg-yellow-500/20 text-yellow-500" };
    }

    return { text: expiryDate, style: "bg-green-500/20 text-green-500" };
};

export { getRatingColorClass, getBadgeClass, getExpiryStatus };