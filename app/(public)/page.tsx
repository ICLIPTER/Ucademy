"use client";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/themeToggle";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface featureProps {
  title: string;
  Description: string;
  icon: string;
}

const features: featureProps[] = [
  {
    title: 'Comprihensive Courses',
    Description: "Access a wide range of carefully curated courses designed by industry experts.",
    icon: '📚',
},
{
    title: 'Interactive Learning',
    Description: "Engage with interactive content, quizzes, and assignments to enhance your learning experience",
    icon: '🎮',
},
{
    title: 'Progress Tracking',
    Description: "Monitor your progress and achivements with detailed analytics and personalized dashboards",
    icon: '📊',
},
{
    title: 'Community Support',
    Description: "Join a vibrant community of learners and instructors to collabrate and share knowledge",
    icon: '👥',
}
]

export default function Home() {
  const router = useRouter();
const { data: session } = authClient.useSession();

async function SignOut() {
  await authClient.signOut({
  fetchOptions: {
    onSuccess: () => {
      router.push("/");
      toast.success("Signed out successfully");
    },
  },
});
}

  return (
   <>
   <section className="relative py-20">
    <div className="flex flex-col items-center text-center space-y-8">
        <Badge variant="outline" >
            The Future of Online Learning
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight ">
      Elevate your learning experience
    </h1>
    <p className="max-w-[700px] text-muted-foreground md:text-xl">Discover new way to learn with our mordon, interactive learning management system. Access high-quality courses anytime, anywhere.</p>

    <div className="flex flex-col sm:flex-row gap-4 mt-8 ">
      <Link className={buttonVariants({size:"lg"})} href="/courses">Explore Courses</Link>

      <Link className={buttonVariants({size:"lg", variant:"outline",})} href="/login">Sign in</Link>
        
    </div>
    </div>
   </section>

   <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {features.map((feature, index) => (
    <Card key={index} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="text-4xl mb-4">
      {feature.icon}</div>
      <CardTitle>{feature.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          {feature.Description}
        </p>
      </CardContent>
      
    </Card>
  ))}    
   </section>
   
   </>
  );
}
