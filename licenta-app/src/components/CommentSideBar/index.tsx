import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "../../utils/trpc";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

type CommentSideProps = {
  postId: string;
};

type CommentFormType = {
  text: string;
};

export const commentFormSchema = z.object({
  text: z.string().min(2),
});
dayjs.extend(relativeTime);

const CommentSideBar = ({ postId }: CommentSideProps) => {
  const [isConditionTrue, setIsConditionTrue] = useState(true);
  const [showCommentsOn, setShowCommentsOn] = useState(true); 
  const [showMore, setShowMore] = useState(true); 

  const makeConditionTrue = () => {
    setIsConditionTrue(true);
  };

  useEffect(() => {
    makeConditionTrue();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { isValid },
    reset,
  } = useForm<CommentFormType>({
    resolver: zodResolver(commentFormSchema),
  });

  const submitComment = trpc.post.submitComment.useMutation({
    onSuccess: () => {
      toast.success("Comment added! 🎉");
      postRoute.getComments.invalidate({ postId });
      reset();
    },
  });

  const getComments = trpc.post.getComments.useQuery({ postId });

  const postRoute = trpc.useContext().post;

  return (
    <div className="h-screen w-[300px] bg-white sm:w-[600px]">
      {isConditionTrue ? (
        <div className="flex h-full w-full flex-col overflow-auto">
          <div className="flex items-center justify-between px-7 py-10 ">
            <h2 className="text-2xl font-medium text-orange-400">
              Comments from this post
            </h2>
            {!showMore && (
                <div className="border-2 border-orange-400 p-4 rounded-md bg-gray-100 shadow-lg">
                    <h1 className="text-orange-500 text-2xl font-bold mb-2">New comment can't reload</h1>
                    <p className="text-gray-700 text-xl">Refresh page</p>
                </div>
            )}
          </div>
          {showCommentsOn ? (
            <div>
              <form
                onSubmit={handleSubmit((data) =>
                  submitComment.mutate({ ...data, postId })
                )}
                className="flex h-full w-full flex-col items-end space-y-4 p-3"
              >
                <input
                  type="text"
                  id="comment"
                  className="h-full w-full rounded-xl border-2 border-orange-400 p-8 shadow-lg focus:border-orange-500 focus:outline-none"
                  placeholder="Leave a comment on my artwork!"
                  {...register("text")}
                />
                {isValid && (
                  <button
                    type="submit"
                    className="flex items-center space-x-3 rounded-xl border border-orange-400 px-3 py-1 text-orange-400 hover:border-orange-500"
                  >
                    Submit
                  </button>
                )}
              </form>
            </div>
          ) : (
            <div className="text-orange-400">
              Can't render comments 
            </div>
          )}
          <div className="flex h-full w-full flex-col">
            {getComments.isSuccess &&
              getComments.data.map((comment, i) => (
                <div
                  className="flex w-full flex-col border-b border-orange-300/50 px-2 py-5 pl-4 last:border-none"
                  key={comment.id}
                >
                  <div className="flex items-center space-x-2">
                    <div className="relative h-10 w-10 rounded-full bg-orange-400"></div>
                    <div>
                      <p className="font-semibold">{comment.user.name}</p>
                      <p>{dayjs(comment.createdAt).fromNow()}</p>
                    </div>
                  </div>
                  <div className="mt-2 pl-5 text-base text-orange-400">
                    {comment.text}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default CommentSideBar;
