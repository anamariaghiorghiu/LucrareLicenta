import React, { useState } from "react";
import { trpc } from "../../utils/trpc";
import dayjs from "dayjs";
import Link from "next/link";
import { BsFillSuitHeartFill } from "react-icons/bs";
import toast from "react-hot-toast";
import { BiBookmarkHeart } from "react-icons/bi";
import { CgHello } from "react-icons/cg";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";

const SideSection = () => {
  const readingList = trpc.post.getReadingList.useQuery();
  const suggestions = trpc.user.getSuggestions.useQuery();
  const followUser = trpc.user.followUser.useMutation({
    onSuccess: () => {
      toast.success("User followed! 👫");
    },
  });
  const unfollowUser = trpc.user.unfollowUser.useMutation({
    onSuccess: () => {
      toast.success("User unfollowed! 🧍");
    },
  });

  const handleFollow = async (userId: string) => {
    await followUser.mutateAsync({ followingUserId: userId });
    setFollowedUsers((prevFollowedUsers) => [...prevFollowedUsers, userId]);
    setShow(true);
  };

  const handleUnfollow = async (userId: string) => {
    await unfollowUser.mutateAsync({ followingUserId: userId });
    setFollowedUsers((prevFollowedUsers) =>
      prevFollowedUsers.filter((id) => id !== userId)
    );
    setShow(true);
  };

  const [followedUsers, setFollowedUsers] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [show, setShow] = useState(false);
  const showSideSection = true;
  const [showMore, setShowMore] = useState(true);

  return (
    <>
      {showSideSection && (
        <aside className="col-span-4 w-full flex-col space-y-4 p-6">
          <div>
            <div className="inline-flex animate-bounce200 items-center">
              <></>
              <CgHello className="text-2xl text-orange-400" />
              <div className="my-4 p-1 text-3xl font-bold text-orange-400">
                Hello there!
              </div>
            </div>
            <h3 className="my-4 p-2 text-lg font-thin">
              Welcome to our blog, a creative space where we proudly showcase
              and share digital drawings created with Stable Diffusion. Our
              passion for art and technology has culminated in this platform,
              where artists from around the world can come together, inspire one
              another, and celebrate the beauty of digital art. <br></br>
              <br></br>
              At our core, we believe in the power of Stable Diffusion to
              revolutionize the way we create and appreciate art. Stable
              Diffusion, with its cutting-edge algorithms and sophisticated
              tools, empowers artists to bring their imagination to life on a
              digital canvas. Through this blog, we aim to highlight the
              incredible potential of Stable Diffusion as a medium for artistic
              expression.
            </h3>
          </div>
          <div>
            <button
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="my-4 flex w-full items-center justify-between rounded-xl border border-gray-200 p-2 hover:border-orange-400"
            >
              <h3 className="text-left text-3xl font-bold text-orange-400">
                Other artists from here you might like
              </h3>
              {showSuggestions ? (
                <AiFillCaretUp className="text-orange-400" />
              ) : (
                <AiFillCaretDown className="text-orange-400" />
              )}
            </button>

            {showSuggestions && (
              <div className="flex flex-col space-y-4">
                {suggestions.isSuccess &&
                  suggestions.data.map((user) => (
                    <div
                      key={user.id}
                      className="flex flex-row items-center justify-between px-6"
                    >
                      <div className="flex items-center space-x-5">
                        <div className="flex-none">
                          <BsFillSuitHeartFill className="h-10 w-10 text-orange-400" />
                        </div>
                        <div>
                          <div className="font-bold text-orange-400">
                            {user.name}
                          </div>
                          <div className="text-xs">{user.username}</div>
                        </div>
                        <></>
                      </div>
                      <div>
                        {followedUsers.includes(user.id) ? (
                          <button
                            className="flex items-center space-x-3 rounded 
                          border px-4 py-2 transition hover:border-orange-400"
                            onClick={() => handleUnfollow(user.id)}
                          >
                            Unfollow
                          </button>
                        ) : (
                          <button
                            className="flex items-center space-x-3 rounded 
                          border px-4 py-2 transition hover:border-orange-400"
                            onClick={() => handleFollow(user.id)}
                          >
                            Follow
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
          <div className="sticky top-20 ">
            <button
              onClick={() => setShowBookmarks(!showBookmarks)}
              className="my-4 flex w-full items-center justify-between rounded-xl border border-gray-200 p-2 hover:border-orange-400"
            >
              <h3 className="text-left text-3xl font-bold text-orange-400">
                Bookmarks & Your favourite articles
              </h3>
              {showBookmarks ? (
                <AiFillCaretUp className="text-orange-400" />
              ) : (
                <AiFillCaretDown className="text-orange-400" />
              )}
            </button>
            {showBookmarks && (
              <div className="flex flex-col space-y-9">
                {readingList.data &&
                  readingList.data.map((bookmark, i) => (
                    <Link
                      href={`/${bookmark.post.slug}`}
                      key={bookmark.id}
                      className="group flex flex-row items-center space-x-6"
                    >
                      <div className="text-8xl text-orange-400">
                        <BiBookmarkHeart />
                      </div>
                      <div className="flex w-full flex-col space-y-2">
                        <div className="text-lg font-semibold text-orange-400 group-hover:underline">
                          {bookmark.post.title}
                        </div>
                        <></>
                        <div className="">
                          {bookmark.post.description.length > 100
                            ? `${bookmark.post.description.slice(0, 98)}...`
                            : bookmark.post.description}
                        </div>
                        <div className="flex w-full items-center space-x-4">
                          <div>
                            <BsFillSuitHeartFill className="h-8 w-8 text-orange-400" />
                          </div>
                          <div className="">
                            {bookmark.post.author.name} &#x2022;
                          </div>
                          <div className="">
                            {dayjs(bookmark.post.createdAt).format(
                              "DD/MM/YYYY"
                            )}
                          </div>
                          {!showMore && (
                            <div className="rounded-md border-2 border-orange-400 bg-gray-100 p-4 shadow-lg">
                              <h1 className="mb-2 text-2xl font-bold text-orange-500">
                                Side section error
                              </h1>
                              <p className="text-xl text-gray-700">Error</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            )}
          </div>
        </aside>
      )}
    </>
  );
};

export default SideSection;
