"use client";

import { Button } from "@/components/ui/button";
import { CourseCategories, CourseLevels, CourseSchema, CourseSchemaType, CourseStatus } from "@/lib/zodSchemas";
import {  Loader2, PlusIcon, SparkleIcon } from "lucide-react";
import { useForm, Resolver,  FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import slugify from "slugify";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RichTextEditor } from "@/components/rich-text-editor/Editor";
import { Uploader } from "@/components/file-uploader/Uploader";
import {  useTransition } from "react";
import { tryCatch } from "@/hooks/try-catch";
 // import { CreateCourse } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { editCourse } from "../actions";
import { AdminCourseSingularType } from "@/app/data/admin/admin-get-course";

interface iAppProps {
  data: AdminCourseSingularType
}


export default function CourseCreation({data}: iAppProps) {
  const [ pending, startTransition] = useTransition();
  const router = useRouter();

    // 1. Define your form.
  const form = useForm<CourseSchemaType>({
    resolver: zodResolver(CourseSchema) as Resolver<CourseSchemaType> ,
    defaultValues: {
        title : data.title,
        description : data.description,
        fileKey : data.fileKey,
        price : data.price,
        duration : data.duration,
        level : data.level,
        category : data.category as CourseSchemaType['category'],
        status : data.status,
        slug : data.slug,
        smallDescription: data.smallDescription,
    },
  });

      function onSubmit(values: CourseSchemaType) {
      
          startTransition(async () => {
            const { data : result, error} = await tryCatch(editCourse(values, data.id));
      
            if(error) {
              toast.error('An unexpected error occurred, Please try again');
              return;
            }
      
            if(result.status === 'success') {
              toast.success(result.message);
              form.reset()
              router.push('/admin/courses')
      
            } else if(result.status === 'error') {
              toast.error(result.message);
            }
          })
          
        }

    return (
        <FormProvider {...form}>
                    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
        
                      <div className="flex gap-4 items-end">
                      <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Slug</FormLabel>
                            <FormControl>
                              <Input placeholder="Slug" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
        
                      <Button type="button" className="w-fit" onClick={() => {
                        const titleValue = form.getValues("title");
        
                        const slug = slugify(titleValue);
        
                        form.setValue("slug", slug, {
                          shouldValidate: true});
                      }}>
                        Generate Slug
                        <SparkleIcon className="ml-1" size={16}/>
                      </Button>
                      </div>
        
                      <FormField
                        control={form.control}
                        name="smallDescription"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Small Description</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Small Description" {...field} className="min-h-[120px]" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                     <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <RichTextEditor field={field} />
                              {/* <Textarea placeholder="Description" {...field} className="min-h-[120px]" /> */}
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                     <FormField
                        control={form.control}
                        name="fileKey"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Thumbnail Image</FormLabel>
                            <FormControl>
                              <Uploader onChange={field.onChange} value={field.value} />         
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select Category"/>
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {CourseCategories.map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                     <FormField
                        control={form.control}
                        name="level"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Level</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select Level"/>
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {CourseLevels.map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                     <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Duration (hours)</FormLabel>
                            <FormControl>
                              <Input placeholder="Duration" type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />  
                     <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Price (₹)</FormLabel>
                            <FormControl>
                              <Input placeholder="Price" type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />  
                     </div>
                     <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select Status"/>
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {CourseStatus.map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
        
                      <Button type="submit" disabled={pending}>
                        {pending ? (
                          <>
                          Updating...
                          <Loader2 className="animate-spin ml-1"/>
                          </>
                        ) : (
                          <>
                          Update Course
                           <PlusIcon className="ml-1" size={16}/>
                          </>
                        )}
                    </Button>
                    </form>
                    
                  </FormProvider>
    )
}