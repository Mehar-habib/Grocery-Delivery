import { auth } from "@/auth";
import connectDB from "@/lib/db";
import User from "@/models/user.model";
import { redirect } from "next/navigation";
import EditRoleAndMobile from "@/components/EditRoleAndMobile";
import Nav from "@/components/Nav";
import UserDashboard from "@/components/UserDashboard";
import AdminDashboard from "@/components/AdminDashboard";
import GeoUpdater from "@/components/GeoUpdater";
import DeliveryBoy from "@/components/DeliveryBoy";
import Grocery, { IGrocery } from "@/models/grocery.model";
import Footer from "@/components/Footer";

export default async function Home(props: {
  searchParams: Promise<{
    q: string;
  }>;
}) {
  const searchParams = await props.searchParams;

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

  let groceryList: IGrocery[] = [];
  if (user.role === "user") {
    if (searchParams.q) {
      groceryList = await Grocery.find({
        $or: [
          { name: { $regex: searchParams.q, $options: "i" } },
          { category: { $regex: searchParams.q, $options: "i" } },
        ],
      });
    } else {
      groceryList = await Grocery.find({});
    }
  }
  return (
    <>
      <Nav user={planUser} />
      <GeoUpdater userId={planUser._id} />
      {user.role == "user" ? (
        <UserDashboard groceryList={groceryList} />
      ) : user.role == "admin" ? (
        <AdminDashboard />
      ) : (
        <DeliveryBoy />
      )}
      <Footer />
    </>
  );
}
