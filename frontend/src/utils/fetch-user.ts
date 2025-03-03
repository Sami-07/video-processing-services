import axios from 'axios';
export async function fetchUser(userId: string) {
   try {
    console.log("userId", userId);
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user?userId=${userId}`);
    return res.data;
   } catch (error) {
    throw error;
   }
}