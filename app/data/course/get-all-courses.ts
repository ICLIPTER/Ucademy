import { prisma } from "@/lib/db";
import { Expletus_Sans } from "next/font/google";

export async function getAllCourses() {
const data = await prisma.course.findMany({
            where: {
                status: "PUBLISHED",
            },
            orderBy: {
                createdAt: "desc",
            },
            select: {
                title: true,
                price: true,
                smallDescription: true,
                slug: true,
                fileKey: true,
                id: true,
                level: true,
                duration: true,
                category: true,
            },
     });

     return data;
}
export type PublicCourseType = Awaited<ReturnType<typeof getAllCourses>>[0];

