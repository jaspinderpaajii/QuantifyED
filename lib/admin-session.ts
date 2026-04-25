import { redirect } from "next/navigation";

import { auth } from "@/auth";

export async function requireAdminSession() {
  const session = await auth();

  if (!session?.user?.email || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  return {
    ...session,
    user: {
      ...session.user,
      email: session.user.email,
    },
  };
}
