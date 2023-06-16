import Prize from "@/app/models/prize";
import { connectToDB } from "@/app/utils/database";

export const GET = async (request) => {
  try {
    await connectToDB();

    const prizes = await Prize.find({});

    return new Response(JSON.stringify(prizes), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch all prizes", { status: 500 });
  }
};
