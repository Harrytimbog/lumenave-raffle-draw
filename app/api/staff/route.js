import Staff from "@/app/models/staff";
import { connectToDB } from "@/app/utils/database";

export const GET = async (request) => {
  try {
    await connectToDB();

    const staffs = await Staff.find({});

    return new Response(JSON.stringify(staffs), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch all staffs", { status: 500 });
  }
};
