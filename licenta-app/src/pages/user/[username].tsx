import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import toast from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Post from "../../components/Post";
import { BsFillSuitHeartFill } from "react-icons/bs";
import Modal from "../../components/Modal";
import { useSession } from "next-auth/react";

const UserProfilePage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const currentUser = session?.user?.id;
  const userRoute = trpc.useContext().user;
  const userProfile = trpc.user.getUserProfile.useQuery(
    {
      username: router.query.username as string,
    },
    { enabled: !!router.query.username }
  );

  const userPosts = trpc.user.getUserPosts.useQuery(
    {
      username: router.query.username as string,
    },
    { enabled: !!router.query.username }
  );

  const [isFollowModalOpen, setIsFollowModalOpen] = useState({
    isOpen: false,
    modalType: "followers",
  });

  const followers = trpc.user.getAllFollowers.useQuery({
    userId: currentUser as string,
  });

  const followings = trpc.user.getAllFollowing.useQuery({
    userId: currentUser as string,
  });

  const followUser = trpc.user.followUser.useMutation({
    onSuccess: () => {
      userRoute.getAllFollowers.invalidate();
      userRoute.getAllFollowing.invalidate();
      userRoute.getUserProfile.invalidate();
      toast.success("User followed! 👫");
    },
  });

  const unfollowUser = trpc.user.unfollowUser.useMutation({
    onSuccess: () => {
      userRoute.getAllFollowers.invalidate();
      userRoute.getAllFollowing.invalidate();
      userRoute.getUserProfile.invalidate();
      toast.success("User unfollowed! 🧍");
    },
  });

  const [showSection, setShowSection] = useState(true);

  const makeShowSectionTrue = () => {
    setShowSection(true);
  };

  useEffect(() => {
    makeShowSectionTrue();
  }, []);
  const [showMore, setShowMore] = useState(true); 

  return (
    <>
      {showSection ? (
        <MainLayout>
          {followings.isSuccess && followers.isSuccess && (
            <Modal
              isOpen={isFollowModalOpen.isOpen}
              onClose={() =>
                setIsFollowModalOpen((pre) => ({ ...pre, isOpen: false }))
              }
            >
              <div className="flex w-full max-w-lg flex-col items-center justify-center space-y-4">
                {isFollowModalOpen.modalType === "followers" &&
                  followers.data?.followedBy.map((user) => (
                    <div
                      key={user.id}
                      className="flex w-full items-start justify-start border-b border-orange-400 px-4 py-2 last:border-none"
                    >
                      <BsFillSuitHeartFill className="h-14 w-14 text-orange-400" />
                      <div className="ml-2 flex max-w-2xl flex-col items-start justify-between">
                        <div className="font-bold">{user.name}</div>
                        <div className="max-w-xs overflow-hidden overflow-ellipsis whitespace-nowrap text-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
                          {user.username}
                        </div>
                        <div className="flex-grow p-2 text-right">
                          <button
                            className="items-center space-x-3 rounded 
    border px-4 py-2 transition hover:border-orange-400"
                            onClick={() =>
                              user.followedBy.length > 0
                                ? unfollowUser.mutate({
                                    followingUserId: user.id,
                                  })
                                : followUser.mutate({
                                    followingUserId: user.id,
                                  })
                            }
                          >
                            {user.followedBy.length > 0 ? "Unfollow" : "Follow"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                {isFollowModalOpen.modalType === "followings" &&
                  followings.data?.followings.map((user) => (
                    <div
                      key={user.id}
                      className="flex w-full items-start justify-between border-b border-orange-400 px-4 py-2 last:border-none"
                    >
                      <div className="flex items-center">
                        <BsFillSuitHeartFill className="h-14 w-14 text-orange-400" />
                        <div className="ml-2 flex flex-col items-start justify-between">
                          <div className="font-bold">{user.name}</div>
                        </div>
                      </div>

                      <div className="flex-grow p-2 text-right">
                        <button
                          className="items-center space-x-3 rounded 
    border px-4 py-2 transition hover:border-orange-400"
                          onClick={() =>
                            unfollowUser.mutate({
                              followingUserId: user.id,
                            })
                          }
                        >
                          Unfollow
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </Modal>
          )}
          <div className="flex h-full w-full items-center justify-center">
            <div className=""></div>
            <div className="my-10 flex h-full w-full flex-col items-center justify-center lg:max-w-screen-md xl:max-w-screen-lg">
              <div className=""></div>
              {!showMore && (
                <div className="border-2 border-orange-400 p-4 rounded-md bg-gray-100 shadow-lg">
                    <h1 className="text-orange-500 text-2xl font-bold mb-2">Tag error</h1>
                </div>
            )}
              <div className="flex w-full flex-col rounded-3xl bg-white shadow-xl">
                <div className=""></div>
                <div className="relative flex h-44 w-full rounded-t-3xl bg-gradient-to-r from-gray-300 to-orange-300">
                  <div className="group absolute -bottom-10 left-14">
                    <div className="relative h-28 w-28">
                      <BsFillSuitHeartFill className="h-28 w-28 text-orange-400" />
                    </div>
                  </div>
                </div>
                <div className="ml-12 mt-10 flex flex-col space-y-1 py-8">
                  <div className="text-4xl font-bold text-orange-400">
                    {userProfile.data?.name}
                  </div>
                  <div className="text-2xl text-orange-400">
                    Username: @{userProfile.data?.username}
                  </div>
                  <div className="text-xl text-orange-400">
                    Activity of {userProfile.data?.name}
                  </div>
                  <div className="text-lg text-orange-300">
                    This user has{" "}
                    <span className="text-orange-400">
                      {userProfile.data?._count.posts ?? 0}
                    </span>{" "}
                    posts.
                  </div>
                  <div className="text-lg text-orange-300">
                    This user has{" "}
                    <button
                      className="text-orange-400 hover:text-xl"
                      onClick={() =>
                        setIsFollowModalOpen({
                          isOpen: true,
                          modalType: "followers",
                        })
                      }
                    >
                      {userProfile.data?._count.followedBy} followers.
                    </button>{" "}
                  </div>
                  <div className="text-lg text-orange-300">
                    This user follows{" "}
                    <button
                      className="text-orange-400 hover:text-xl"
                      onClick={() =>
                        setIsFollowModalOpen({
                          isOpen: true,
                          modalType: "followings",
                        })
                      }
                    >
                      {userProfile.data?._count.followings} accounts.
                    </button>
                  </div>
                  <div className="text-orange-400"></div>
                </div>
              </div>
              <div className="my-10 h-full w-full">
                {userPosts.isLoading && (
                  <div className="flex h-full w-full justify-center">
                    <div>Loading...</div>
                    <div>
                      <AiOutlineLoading3Quarters className="animate-spin text-orange-400" />
                    </div>
                  </div>
                )}
                {userPosts.isSuccess &&
                  userPosts.data?.posts.map((post) => (
                    <Post text={null} tags={[]} {...post} key={post.id} />
                  ))}
              </div>
            </div>
          </div>
        </MainLayout>
      ) : (
        <></>
      )}
    </>
  );
};

export default UserProfilePage;
