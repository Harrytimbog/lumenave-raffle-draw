import Prize from "@/app/models/prize";
import { connectToDB } from "@/app/utils/database";

export const POST = async (request) => {
  const { name } = await request.json();

  try {
    await connectToDB();
    const newContestant = new Prize({ name });

    await newContestant.save();
    return new Response(JSON.stringify(newContestant), { status: 201 });
  } catch (error) {
    return new Response("Failed to create a new contestant", { status: 500 });
  }
};
