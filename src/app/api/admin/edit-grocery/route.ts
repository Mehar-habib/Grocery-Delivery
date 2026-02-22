import { auth } from "@/auth";
import uploadCloudinary from "@/lib/cloudinary";
import connectDB from "@/lib/db";
import Grocery from "@/models/grocery.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return NextResponse.json(
        { message: "You are not authorized" },
        { status: 401 },
      );
    }
    const formData = await req.formData();
    const name = formData.get("name");
    const groceryId = formData.get("groceryId");
    const price = formData.get("price");
    const unit = formData.get("unit");
    const category = formData.get("category");
    const file = formData.get("image") as Blob | null;
    let imageUrl;
    if (file) {
      imageUrl = await uploadCloudinary(file);
    }
    const grocery = await Grocery.findByIdAndUpdate(groceryId, {
      name,
      price,
      unit,
      category,
      image: imageUrl,
    });
    return NextResponse.json(
      { message: "Grocery added successfully", grocery },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: `Something went wrong ${error}` },
      { status: 500 },
    );
  }
}
