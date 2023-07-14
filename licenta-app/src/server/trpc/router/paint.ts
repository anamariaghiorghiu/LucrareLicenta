import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const paintingRouter = router({
    createPainting: protectedProcedure
    .input(
        z.object({
            userId: z.string().nonempty(),
            image: z.string().nonempty(),
        })
    )
    .mutation(
        async({ctx:{prisma, session}, input:{userId, image}})=>{
            const newPainting = await prisma.painting.create({
                data: {
                    userId,
                    image,
                },
            });
            return newPainting;
        }
    ),

    getAllPaintings: protectedProcedure
    .input(z.object({ userId: z.string().nonempty() }))
    .query(async ({ ctx: { prisma, session }, input: { userId } }) => {
      const paintings = await prisma.painting.findMany({
        where: { userId },
      });
      return paintings;
    }),

    getPainting: protectedProcedure
    .input(z.string().nonempty()) 
    .query(async ({ ctx: { prisma, session }, input: paintingId }) => {
        const painting = await prisma.painting.findUnique({
            where: { id: paintingId },
        });

        if (!painting) {
            throw new Error('Painting not found');
        }
        return painting.image;
    }),

});
