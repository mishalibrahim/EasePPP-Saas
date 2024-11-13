"use server";

import { productDetailSchema } from "@/schemas/products";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { createProduct as createProductDb } from "../db/products";
import { redirect } from "next/navigation";

export async function createProduct(
  unsafeData: z.infer<typeof productDetailSchema>
):Promise<{error:boolean,message:string | undefined}> {
  const { userId } = auth();
  const {success,data} = productDetailSchema.safeParse(unsafeData)

  if(!success || userId == null){
    return {error:true,message:'There was an error creating your product'}
  }

  const {id} = await createProductDb({...data,clerkUserId:userId});

  redirect(`/dahsboard/products/${id}/edit?tab=countries`)
}
