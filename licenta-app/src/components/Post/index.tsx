import Link from "next/link";
import React, { useState } from "react";
import dayjs from "dayjs";
import { CiBookmarkCheck, CiBookmarkPlus } from "react-icons/ci";
import { RouterOutputs, trpc } from "../../utils/trpc";
import { BsFillSuitHeartFill } from "react-icons/bs";
import Image from "next/image";
import toast from "react-hot-toast";

type PostProps = {
  tags: { id: string; name: string }[];
  featuredImage?: string | null;
} & RouterOutputs["post"]["getPosts"][number];

const PostCard = ({ ...post }: PostProps) => {
  const [isBookmarked, setIsBookmarked] = useState(
    post.bookmarks && post.bookmarks.length > 0
  );
  const postRoute = trpc.useContext().post;
  const bookmarkPost = trpc.post.bookmarkPost.useMutation({
    onSuccess: () => {
      setIsBookmarked((prev) => !prev);
      postRoute.getReadingList.invalidate();
      setShow(false)
    },
  });
  const removeBookmark = trpc.post.removeBookmark.useMutation({
    onSuccess: () => {
      setIsBookmarked((prev) => !prev);
      postRoute.getReadingList.invalidate();
    },
  });
  const bookmarkButton = isBookmarked ? (
    <button
      className="flex items-center space-x-3 rounded 
        border px-4 py-2 transition hover:border-orange-400"
      onClick={() => {
        toast("You unbookmarked this post 📖");
        removeBookmark.mutate({ postId: post.id });
        setShow(false)
      }}
    >
      <div>
        <CiBookmarkCheck className="text-3xl text-orange-500" />
      </div>
      <div>Unbookmark</div>
    </button>
  ) : (
    <button
      className="flex items-center space-x-3 rounded 
        border px-4 py-2 transition hover:border-orange-400"
      onClick={() => {
        toast("You bookmarked this post 📚");
        bookmarkPost.mutate({ postId: post.id });
        setShow(false)
      }}
    >
      <div>
        <CiBookmarkPlus className="text-3xl text-orange-500" />
      </div>
      <div>Bookmark</div>
    </button>
  );

  const painting = trpc.post.getPostFeaturedImage.useQuery({ postId: post.id });
  const painting_string = trpc.painting.getPainting.useQuery(
    painting.data as string
  );
  const [show, setShow] = useState(false);
  const showSection = true;
  const [showMore, setShowMore] = useState(true); 

  return (
    <>
    {showSection && (
      <div
        key={post.id}
        className="flex border-b border-orange-300/50 pb-6 last:border-none"
      >
        <div className="w-1/4">
          <></>
          <div className="h-full w-full transform rounded-xl border-2 border-orange-400 transition duration-300 hover:scale-105 hover:shadow-lg">
            <Image
              src={painting_string.data as string}
              alt={`Painting`}
              width={400}
              height={400}
            />
          </div>
        </div>
        <div className="w-3/4 pl-4">
          <Link
            href={`/user/${post.author.username}`}
            className="flex cursor-pointer items-center space-x-4"
          >
            <div className="relative">
              <BsFillSuitHeartFill className="h-10 w-10 text-orange-400" />
            </div>
            <></>
            <div className="group ">
              <div className="my-1  cursor-pointer font-semibold">
                <span className="decoration-orange-400 group-hover:underline">
                  {post.author.name}
                </span>{" "}
                &#x2022; {dayjs(post.createdAt).format("DD/MM/YYYY")}
              </div>
            </div>
          </Link>
          <div className="grid w-full grid-cols-12 gap-4">
            <Link
              href={`/${post.slug}`}
              className="col-span-12 flex h-full w-full flex-col space-y-4"
            >
              <p className="text-2xl font-bold text-orange-400">{post.title}</p>
              <p className="text-sm text-gray-500 ">
                {post.description.length > 100
                  ? `${post.description.slice(0, 98)}...`
                  : post.description}
              </p>
            </Link>
          </div>
          <></>
          <div className="flex justify-between">
            <div className="flex w-full items-center justify-start space-x-4 ">
              <div>Domains of this post:</div>
              <div className="flex items-center space-x-2">
                {post.tags?.map((tag: { id: string; name: string }) => (
                  <div
                    key={tag.id}
                    className="rounded-2xl bg-orange-300/50 px-3.5 text-xs"
                  >
                    {tag.name}
                  </div>
                ))}
              </div>
            </div>
            <></>
            <div className="flex w-full items-center justify-end">
              {bookmarkButton}
            </div>
          </div>
          {!showMore && (
                <div className="border-2 border-orange-400 p-4 rounded-md bg-gray-100 shadow-lg">
                    <h1 className="text-orange-500 text-2xl font-bold mb-2">Can't render the postcard</h1>
                    <p className="text-gray-700 text-xl">Error</p>
                </div>
            )}
        </div>
      </div>)}
    </>
  );
};

export default PostCard;
