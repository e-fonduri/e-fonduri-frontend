import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "../api/auth/[...nextauth]/route";

type Props = {
  children: React.ReactNode;
};

export default async function DashboardLayout(props: Props) {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <div>You're logged in and this is your email: {session?.user.email}</div>
      <div>{props.children}</div>
    </div>
  );
}
