import Staff from "@/app/models/staff";
import { connectToDB } from "@/app/utils/database";

export const DELETE = async (request, { params }) => {
  try {
    await connectToDB();

    // Find the prompt by ID and remove it
    await Staff.findByIdAndRemove(params.id);

    return new Response("Staff deleted successfully", { status: 200 });
  } catch (error) {
    return new Response("Error deleting staff", { status: 500 });
  }
};
