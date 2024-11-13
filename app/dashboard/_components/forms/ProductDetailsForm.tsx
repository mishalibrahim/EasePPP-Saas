"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { productDetailSchema } from "@/schemas/products";
import { createProduct } from "@/server/actions/products";
import { toast } from "@/hooks/use-toast";

export function ProductDetailsForm() {
  const form = useForm<z.infer<typeof productDetailSchema>>({
    resolver: zodResolver(productDetailSchema),
    defaultValues:{
        name:'',
        url:'',
        description:'',
    }
  });

  const onSubmit = async(values: z.infer<typeof productDetailSchema>) => {
    const data = await createProduct(values)

    if(data?.message){
        toast({
            title:data.error? "error" :"success",
            description:data.message,
            variant:data.error ? "destructive" : 'default'
        })
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex gap-6 flex-col"
      >
        <div className="grid gap-6  grid-cols-1 lg:grid-cols-2 ">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter Website Url</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                    Include the protocol (http and https) and full paths to  the sales page 
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
            <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Description</FormLabel>
                <FormControl>
                  <Textarea {...field} className="min-h-20 resize-none" />
                </FormControl>
                <FormDescription>
                   An optional description to distinguish form other products
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="self-end">
            <Button disabled={form.formState.isSubmitting} type="submit">
                Save
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
