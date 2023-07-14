import slugify from "slugify";
import { writeFormSchema } from "../../../components/WriteFormModal";
import { router, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";

export const postRouter = router({
  createPost: protectedProcedure
    .input(
      writeFormSchema.and(
        z.object({
          tagIds: z.array(z.object({ id: z.string() })).optional(),
          paintingId: z.string().optional(),
        })
      )
    )
    .mutation(
      async ({
        ctx: { prisma, session },
        input: { title, description, tagIds, paintingId },
      }) => {
        const existingPost = await prisma.post.findFirst({
          where: {
            OR: [{ title: title }, { slug: slugify(title) }],
          },
        });

        if (existingPost) {
          throw new Error("A post with this title or slug already exists.");
        }

        let painting = null;
        if (paintingId) {
          painting = await prisma.painting.findUnique({
            where: { id: paintingId },
          });

          if (!painting) {
            throw new Error(`No painting found with id: ${paintingId}`);
          }
        }

        const newPost = await prisma.post.create({
          data: {
            title,
            description,
            slug: slugify(title),
            author: {
              connect: { id: session.user.id },
            },
            tags: {
              connect: tagIds,
            },
            featuredImage: painting?.id ?? "placeholder-url", 
            html: "placeholder-html", 
            text: "placeholder-text", 
          },
        });

        return newPost;
      }
    ),

  getPosts: publicProcedure.query(async ({ ctx: { prisma, session } }) => {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        text: true,
        featuredImage: true, 
        createdAt: true,
        author: {
          select: {
            name: true,
            image: true,
            username: true,
          },
        },
        tags: {
          select: {
            name: true,
            slug: true,
            id: true,
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
    });
    return posts;
  }),

  getPost: publicProcedure
    .input(
      z.object({
        slug: z.string(),
      })
    )
    .query(async ({ ctx: { prisma, session }, input: { slug } }) => {
      const post = await prisma.post.findUnique({
        where: {
          slug,
        },
        select: {
          id: true,
          description: true,
          title: true,
          text: true,
          featuredImage: true, 
          likes: session?.user?.id
            ? {
                where: {
                  userId: session?.user?.id,
                },
              }
            : false,
          tags: {
            select: {
              name: true,
              id: true,
              slug: true,
            },
          },
        },
      });
      return post;
    }),

  bookmarkPost: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx: { prisma, session }, input: { postId } }) => {
      await prisma.bookmark.create({
        data: {
          userId: session.user.id,
          postId,
        },
      });
    }),

  removeBookmark: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx: { prisma, session }, input: { postId } }) => {
      const bookmark = await prisma.bookmark.findFirst({
        where: {
          postId: postId,
          userId: session.user.id,
        },
      });

      if (bookmark) {
        await prisma.bookmark.delete({
          where: {
            id: bookmark.id,
          },
        });
      } else {
        throw new Error("Bookmark not found");
      }
    }),

  submitComment: protectedProcedure
    .input(
      z.object({
        text: z.string().min(3),
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx: { prisma, session }, input: { text, postId } }) => {
      await prisma.comment.create({
        data: {
          text,
          user: {
            connect: {
              id: session.user.id,
            },
          },
          post: {
            connect: {
              id: postId,
            },
          },
        },
      });
    }),

  getComments: publicProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .query(async ({ ctx: { prisma }, input: { postId } }) => {
      const comments = await prisma.comment.findMany({
        where: {
          postId,
        },
        select: {
          id: true,
          text: true,
          user: {
            select: {
              name: true,
              image: true,
            },
          },
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return comments;
    }),

  getReadingList: protectedProcedure.query(
    async ({ ctx: { prisma, session } }) => {
      const allBookmarks = await prisma.bookmark.findMany({
        where: {
          userId: session.user.id,
        },
        take: 4,
        select: {
          id: true,
          post: {
            select: {
              title: true,
              description: true,
              author: {
                select: {
                  name: true,
                  image: true,
                },
              },
              createdAt: true,
              slug: true,
              featuredImage: true, 
            },
          },
        },
      });

      return allBookmarks;
    }
  ),

  getPostFeaturedImage: publicProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .query(async ({ ctx: { prisma }, input: { postId } }) => {
      const post = await prisma.post.findUnique({
        where: {
          id: postId,
        },
        select: {
          featuredImage: true, // Only select the featuredImage
        },
      });
      if (!post) {
        throw new Error("No post found with this ID.");
      }
      return post.featuredImage;
    }),

  getBookmarkImages: protectedProcedure.query(
    async ({ ctx: { prisma, session } }) => {
      const allBookmarks = await prisma.bookmark.findMany({
        where: {
          userId: session.user.id,
        },
        select: {
          post: {
            select: {
              featuredImage: true,
            },
          },
        },
      });

      // Map over the returned array of bookmarks and create a new array of base64 images.
      const allImages = allBookmarks.map(
        (bookmark) => bookmark.post.featuredImage
      );

      return allImages;
    }
  ),
});
