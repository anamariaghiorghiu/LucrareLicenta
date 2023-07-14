import { z } from "zod"
import {protectedProcedure, router} from "../trpc"
import slugify from "slugify"
import { TRPCError } from "@trpc/server"

export const tagRouter = router({
    createTag: protectedProcedure.input(
        z.object({
            name:z.string(),
            description:z.string()
        })
    ).mutation(
        async({ctx:{prisma},input})=>{
            const tag = await prisma.tag.findUnique({
                where:{
                    name:input.name 
                }
            })

            if(tag){
                throw new TRPCError({
                    code: "CONFLICT",
                    message:"tag already exists"
                })
            }

            await prisma.tag.create({
                data:{
                    ...input,
                    slug:slugify(input.name)
                }
            })
        }
    ),

    getTags: protectedProcedure.query(async ({ctx:{prisma}})=>{
        return await prisma.tag.findMany()
    })
})