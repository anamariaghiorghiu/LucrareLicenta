import React, { useContext, useState, useEffect } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { trpc } from "../../utils/trpc";
import Post from "../Post";
import { FiEdit } from "react-icons/fi";
import { GlobalContext } from "../../contexts/GlobalContextPro";

const MainSection = () => {
  const getPosts = trpc.post.getPosts.useQuery();
  const getTags = trpc.tag.getTags.useQuery();
  const [showWriteButton, setShowWriteButton] = useState(true);
  const [showTags, setShowTags] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showSection, setShowSection] = useState(true);
  const [showMore, setShowMore] = useState(true); 
  
  const filteredPosts = selectedTag
    ? getPosts.data?.filter((post) =>
        post.tags.some((tag) => tag.id === selectedTag)
      )
    : getPosts.data;
  const { setIsWriteModalOpen } = useContext(GlobalContext);

  const makeShowSectionTrue = () => {
    setShowSection(true);
  };

  useEffect(() => {
    makeShowSectionTrue();
  }, []);
  useEffect(() => {
    setShowWriteButton(true);
    setShowTags(true);
  }, []);

  return (
    <>
      {showSection ? (
        <main className="col-span-8 h-full w-full border-r border-orange-300/50">
          <div className=""></div>
          <div className="flex w-full flex-col space-y-4 px-24 py-10 ">
            <div className="flex w-full items-center space-x-4">
              {showWriteButton ? (
                <div className="transform rounded-xl border-2 border-orange-400 text-orange-400 transition-all duration-200 hover:scale-110">
                  <button
                    onClick={() => setIsWriteModalOpen(true)}
                    className="flex items-center space-x-3 
            rounded-xl border px-10 py-2 transition"
                  >
                    <div>
                      <FiEdit />
                    </div>
                    <div>Write</div>
                    <h3></h3>
                  </button>
                </div>
              ) : (
                <div>Can't render Write button</div>
              )}
              {!showMore && (
                <div className="border-2 border-orange-400 p-4 rounded-md bg-gray-100 shadow-lg">
                    <h1 className="text-orange-500 text-2xl font-bold mb-2">No photos added yet</h1>
                    <p className="text-gray-700 text-xl">Feel free to post for the first time</p>
                </div>
            )}

              <div className="flex w-full items-center justify-end">
                <div className="flex items-center space-x-2">
                  {showTags ? (
                    <>
                      <div
                        className="m-2 flex cursor-pointer items-center justify-center space-x-2 whitespace-nowrap rounded-2xl bg-orange-300/50 px-2.5 py-1"
                        onClick={() => setSelectedTag(null)}
                      >
                        None
                        <></>
                      </div>
                      {getTags.data?.map((tag) => (
                        <div
                          key={tag.id}
                          className="m-2 flex cursor-pointer items-center justify-center space-x-2 whitespace-nowrap rounded-2xl bg-orange-300/50 px-2.5 py-1"
                          onClick={() => setSelectedTag(tag.id)}
                        >
                          {tag.name}
                        </div>
                      ))}
                    </>
                  ) : (
                    <div>Can't render tags</div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex w-full items-center justify-between  border-b border-orange-300 pb-8"></div>
            <div className="flex w-full flex-col justify-center space-y-8">
              {getPosts.isLoading && (
                <div className="flex h-full w-full justify-center">
                  <div>Loading...</div>
                  <div>
                    <AiOutlineLoading3Quarters className="animate-spin text-orange-400" />
                  </div>
                </div>
              )}
              {getPosts.isSuccess &&
                filteredPosts?.map((post) => <Post {...post} key={post.id} />)}
            </div>
            <></>
          </div>
        </main>
      ) : (
        <></>
      )}
    </>
  );
};

export default MainSection;
