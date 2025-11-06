import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export async function getIndividualCourse(slug: string) {
    const course =  await prisma.course.findUnique({
        where: {
            slug: slug,
        },
        select: {
            title: true,
            price: true,
            smallDescription: true,
            fileKey: true,
            id: true,
            level: true,
            duration: true,
            category: true,
            description: true,
            chapter: {
                select: {
                    id: true,
                    title: true,
                    lessons: {
                        select: {
                            id: true,
                            title: true,
                        },
                        orderBy: {
                            position: "asc",
                        },
                    },
                },
                orderBy: {
                    position: "asc",
                },
            },
        },
    });

        if(!course) {
            return notFound();
        }

        return course;
}