import { auth } from "@/auth";
import connectDB from "@/lib/db";
import User from "@/models/user.model";
import { redirect } from "next/navigation";
import EditRoleAndMobile from "@/components/EditRoleAndMobile";
import Nav from "@/components/Nav";
import UserDashboard from "@/components/UserDashboard";
import AdminDashboard from "@/components/AdminDashboard";
import DeliverBoyDashboard from "@/components/DeliverBoyDashboard";
import GeoUpdater from "@/components/GeoUpdater";

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
      <GeoUpdater userId={planUser._id} />
      {user.role == "user" ? (
        <UserDashboard />
      ) : user.role == "admin" ? (
        <AdminDashboard />
      ) : (
        <DeliverBoyDashboard />
      )}
    </>
  );
}
