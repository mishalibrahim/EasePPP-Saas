import { getProducts } from "@/server/db/products";
import { auth } from "@clerk/nextjs/server";
import NoProducts from "./_components/NoProducts";

export default async function DashboardPage() {
  const {userId,redirectToSignIn} = auth()
  if(userId == null){
    return redirectToSignIn()
  }
  const products = await getProducts(userId,{limit:6});

  if(products.length === 0) return <NoProducts/>
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard!</p>
    </div>
  );
}