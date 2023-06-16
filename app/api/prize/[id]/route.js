import Prize from "@/app/models/prize";
import { connectToDB } from "@/app/utils/database";

export const DELETE = async (request, { params }) => {
  try {
    await connectToDB();

    // Find the prompt by ID and remove it
    await Prize.findByIdAndRemove(params.id);
    console.log("WHAAAAAAAT!!!!");

    return new Response("Prize deleted successfully", { status: 200 });
  } catch (error) {
    return new Response("Error deleting prize", { status: 500 });
  }
};
