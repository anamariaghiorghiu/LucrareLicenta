import { z } from "zod";
import {protectedProcedure, publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";

export const userRouter = router({
    getUserProfile: publicProcedure.input(
        z.object({
          username: z.string()
        })
      ).query(async ({ctx:{prisma}, input:{username}}) => {
        return await prisma?.user.findUnique({
            where:{
              username:username,
            },
            select:{
              name:true,
              image:true,
              id:true,
              username:true,
              _count:{
                select:{
                  posts:true,
                  followedBy:true,
                  followings:true
                }
              }
            },
        })
      }),

      getUserPosts: publicProcedure.input(
      z.object({
        username: z.string(),
      })
    )
    .query(async ({ ctx: { prisma, session }, input: { username } }) => {
      return await prisma.user.findUnique({
        where: {
          username,
        },
        select: {
          posts: {
            select: {
              id: true,
              slug: true,
              title: true,
              description: true,
              createdAt: true,
              featuredImage: true,
              author: {
                select: {
                  name: true,
                  image: true,
                  username: true,
                },
              },
              bookmarks: session?.user?.id
                ? {
                    where: {
                      userId: session?.user?.id,
                    },
                  }
                : false,
            },
          },
        },
      });
    }),
    
    getUserProfileById: publicProcedure.input(
      z.object({
        id: z.string()
      })
    ).query(async ({ctx:{prisma}, input:{id}}) => {
      return await prisma?.user.findUnique({
          where:{
            id:id,
          },
          select:{
            name:true,
            image:true,
            id:true,
            username:true,
            _count:{
              select:{
                posts:true
              }
            }
          },
      })
    }),

    getSuggestions: protectedProcedure.query(
      async({ctx: { prisma, session }})=>{
        const likedPostTags = await prisma.like.findMany({
          where:{
            userId:session?.user?.id
          },
          select:{
            post:{
              select:{
                tags:{
                  select:{
                    name:true
                  }
                }
              }
            }
          },
          take: 10 
        })
        const bookmarkedPostTags = await prisma.bookmark.findMany({
          where:{
            userId:session?.user?.id
          },
          select:{
            post:{
              select:{
                tags:{
                  select:{
                    name:true
                  }
                }
              }
            }
          },
          take: 10 
        })
        const interestedTags:string[] = []
        likedPostTags.forEach((like)=>{
          interestedTags.push(...like.post.tags.map((tag)=>tag.name))
        })
        bookmarkedPostTags.forEach((bookmark)=>{
          interestedTags.push(...bookmark.post.tags.map((tag)=>tag.name))
        })
        const suggestions = await prisma.user.findMany({
          where:{
            OR:[
              {
                likes:{
                  some:{
                    post:{
                      tags:{
                        some:{
                          name:{
                            in: interestedTags
                          }
                        }
                      }
                    }
                  }
                }
              },{
                bookmarks:{
                  some:{
                    post:{
                      tags:{
                        some:{
                          name:{
                            in: interestedTags
                          }
                        }
                      }
                    }
                  }
                }
              }
            ],
            NOT:{
              id:session.user.id,
            }
          },
          select:{
            name:true,
            username:true,
            id:true
          },
          take:4
        })
        return suggestions
      }
    ),

    followUser: protectedProcedure
    .input(
      z.object({
        followingUserId: z.string(),
      })
    )
    .mutation(
      async ({ ctx: { prisma, session }, input: { followingUserId } }) => {
        if (followingUserId === session.user.id) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "you can't follow yourself",
          });
        }

        await prisma.user.update({
          where: {
            id: session.user.id,
          },
          data: {
            followings: {
              connect: {
                id: followingUserId,
              },
            },
          },
        });
      }
    ),

  unfollowUser: protectedProcedure
    .input(
      z.object({
        followingUserId: z.string(),
      })
    )
    .mutation(
      async ({ ctx: { prisma, session }, input: { followingUserId } }) => {
        await prisma.user.update({
          where: {
            id: session.user.id,
          },
          data: {
            followings: {
              disconnect: {
                id: followingUserId,
              },
            },
          },
        });
      }
    ),

  getAllFollowers: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx: { prisma, session }, input: { userId } }) => {
      return await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          followedBy: {
            select: {
              name: true,
              username: true,
              id: true,
              image: true,
              followedBy: {
                where: {
                  id: session.user.id,
                },
              },
            },
          },
        },
      });
    }),
  getAllFollowing: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx: { prisma, session }, input: { userId } }) => {
      return await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          followings: {
            select: {
              name: true,
              username: true,
              id: true,
              image: true,
            },
          },
        },
      });
    }),
    
})