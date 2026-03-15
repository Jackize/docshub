import { auth } from "@/auth";
import { redirect } from "next/navigation";
import WorkspaceClient from "@/components/WorkspaceClient";

export default async function WorkspacePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return <WorkspaceClient user={session.user} />;
}
