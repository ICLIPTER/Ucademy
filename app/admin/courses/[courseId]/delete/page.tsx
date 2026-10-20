import { DeleteCoursePanel } from "./_components/DeleteCoursePanel";

export const metadata = {
  title: "Delete course",
  description: "Permanently remove a course and all of its content.",
};

export default async function DeleteCourseRoute({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;

  return <DeleteCoursePanel courseId={courseId} />;
}
