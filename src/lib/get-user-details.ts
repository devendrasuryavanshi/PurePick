import User from "@/models/user-model";

const getUserDetails = async (userId: string): Promise<any> => {
    const userData = await User.findById(userId);
    return userData;
}

export default getUserDetails;