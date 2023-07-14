import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BsChat } from "react-icons/bs";
import MainLayout from "../layouts/MainLayout";
import { trpc } from "../utils/trpc";
import CommentSideBar from "../components/CommentSideBar";
import Image from "next/image";

const PostPage = () => {
  const router = useRouter();

  const getPost = trpc.post.getPost.useQuery(
    {
      slug: router.query.slug as string,
    },
    {
      enabled: Boolean(router.query.slug),
    }
  );

  const painting = trpc.post.getPostFeaturedImage.useQuery({
    postId: getPost.data?.id as string,
  });
  const painting_string = trpc.painting.getPainting.useQuery(
    painting.data as string
  );
  
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
          <div className="grid grid-cols-12 gap-4 ">
            <div className="col-span-8 space-y-7 border-r border-orange-300/50">
              {getPost.isLoading && (
                <div className="flex h-full w-full justify-center">
                  <div>Loading...</div>
                  <div>
                    <AiOutlineLoading3Quarters className="animate-spin text-orange-400" />
                  </div>
                </div>
              )}
              {getPost.isSuccess && (
                <>
                  <div className="fixed bottom-10 flex w-full items-center justify-center"></div>
                  <div className="flex h-full w-full flex-col items-center justify-center p-10">
                    <div className="flex w-full max-w-screen-lg flex-col space-y-4">
                      <div className="h-[70vh] w-full bg-white shadow-lg">
                        <Image
                          src={painting_string.data as string}
                          alt={`Painting`}
                          width={1500}
                          height={800}
                        />
                      </div>
                      <div className=" p-5 pl-6 text-6xl text-orange-400">
                        {getPost.data?.title}
                      </div>
                      <div className="text-2xl">{getPost.data?.description}</div>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="col-span-4">
              {getPost.data?.id && <CommentSideBar postId={getPost.data?.id} />}
            </div>
            {!showMore && (
                <div className="border-2 border-orange-400 p-4 rounded-md bg-gray-100 shadow-lg">
                    <h1 className="text-orange-500 text-2xl font-bold mb-2">Side section error</h1>
                </div>
            )}
          </div>
        </MainLayout>
      ) : (
        <></>
      )}
    </>
  );
};

export default PostPage;
