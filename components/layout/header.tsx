// components/layout/header.tsx
import { HeaderClient } from "./HeaderClient";

export async function Header() {
  // In a real app, you would fetch the server session here:
  // const session = await getServerSession(authOptions);
  // For this landing page, we'll assume the user is not logged in.
  const user = null;
  return <HeaderClient user={user} />;
}