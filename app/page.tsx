import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardClient from "@/components/DashboardClient";

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  const companies = await prisma.company.findMany({
    orderBy: {
      name: "asc"
    },
    include: {
      _count: {
        select: { roles: true }
      }
    }
  });

  let initialBookmarks: string[] = [];

  if (session?.user) {
    const userId = (session.user as any).id;
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      select: { companyId: true }
    });
    initialBookmarks = bookmarks.map(b => b.companyId);
  }

  return <DashboardClient companies={companies} initialBookmarks={initialBookmarks} />;
}
