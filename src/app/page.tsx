import { auth } from "@/auth";
import connectDB from "@/lib/db";
import User from "@/models/user.model";
import { redirect } from "next/navigation";
import EditRoleAndMobile from "@/components/EditRoleAndMobile";
import Nav from "@/components/Nav";

export default async function Home() {
  await connectDB();
  const session = await auth();
  const user = await User.findById(session?.user?.id);
  if (!user) {
    redirect("/login");
  }
  const inComplete =
    !user.mobile || !user.role || (!user.mobile && user.role === "user");
  if (inComplete) {
    return <EditRoleAndMobile />;
  }
  const planUser = JSON.parse(JSON.stringify(user));
  return (
    <>
      <Nav user={planUser} />
    </>
  );
}
