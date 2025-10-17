import { AdminCourseType } from "@/app/data/admin/admin-get-courses";
import { Card, CardContent,  } from "@/components/ui/card";
import { useConstructUrl } from "@/hooks/use-construct";
import Image from "next/image";
import Link from "next/link";

interface iAppProps {
    data : AdminCourseType;
}

export function AdminCourseCard({data} : iAppProps) {
    const thumbnailUrl = useConstructUrl(data.fileKey)
    return (
        <Card className="group relative">
            {/* absolute dropdown*/ }
            <div></div>
            <Image 
            src={thumbnailUrl} 
            alt="Thumbnail Url"
            width={600} 
            height={400} 
            className="w-full rounded-t-lg aspect-video h-full object-cover"
         />

        <CardContent>
            <Link href={`/admin/courses/${data.id}`} className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-pimary transition-colors">
            {data.title}
            </Link>
        </CardContent>
        </Card>
    )
}
