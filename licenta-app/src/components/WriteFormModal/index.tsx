import React, { useContext, useState } from "react";
import Modal from "../Modal";
import { GlobalContext } from "../../contexts/GlobalContextPro";
import { BiImage, BiPencil } from "react-icons/bi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "../../utils/trpc";
import { toast } from "react-hot-toast";
import { AiOutlineCheck, AiOutlineLoading3Quarters } from "react-icons/ai";
import TagsAutocompletion from "../TagsAutocompletion";
import { BsTagsFill } from "react-icons/bs";
import TagForm from "../TagForm";
import { FaTimes } from "react-icons/fa";
import { useSession } from "next-auth/react";
import PhotoSelectionModal from "../PhotoSelectionModal";

type WriteFormType = {
  title: string;
  description: string;
};
export const writeFormSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(10),
});
export type TAG = { id: string; name: string };

const WriteFormModal = () => {
  const createPost = trpc.post.createPost.useMutation({
    onSuccess: () => {
      toast.success("post created successfully! 🥳");
      setIsWriteModalOpen(false);
      reset();
      setPaintingId(null);
      postRoute.getPosts.invalidate();
    },
    onError: (error) => {
      console.error("Error creating post:", error);
    },
  });
  const postRoute = trpc.useContext().post;
  const { isWriteModalOpen, setIsWriteModalOpen } = useContext(GlobalContext);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WriteFormType>({
    resolver: zodResolver(writeFormSchema),
  });
  const [isTagCreateModalOpen, setIsTagCreateModalOpen] = useState(false);
  const getTags = trpc.tag.getTags.useQuery();
  const [isPhotoUploaded, setIsPhotoUploaded] = useState(false);
  const onSubmit = (data: WriteFormType) => {
    const mutationData: any = {
      ...data,
      tagIds: selectedTags.map((tag) => ({ id: tag.id })),
    };

    if (paintingId) {
      mutationData.paintingId = paintingId;
    }

    createPost.mutate(mutationData);
  };

  const [paintingId, setPaintingId] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<TAG[]>([]);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [showMore, setShowMore] = useState(true); 

  return (
    <>
      <Modal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
      >
        {getTags.isSuccess && (
          <>
            <TagForm
              isOpen={isTagCreateModalOpen}
              onClose={() => setIsTagCreateModalOpen(false)}
            />
            <div className="flex w-full pb-2">
              <div className="z-10 w-4/5 pr-10">
                <TagsAutocompletion
                  tags={getTags.data}
                  setSelectedTags={setSelectedTags}
                  selectedTags={selectedTags}
                />
              </div>
              <div className="flex w-full items-center text-orange-400">
                <button
                  className="flex space-x-3 rounded border
                      bg-orange-100/50 px-4 py-2 shadow-md transition hover:border-orange-400"
                  onClick={() => setIsTagCreateModalOpen(true)}
                >
                  <div>
                    <BsTagsFill />
                  </div>
                  <div className="text-sm">Add New Tag</div>
                </button>
              </div>
              {!showMore && (
                <div className="border-2 border-orange-400 p-4 rounded-md bg-gray-100 shadow-lg">
                    <h1 className="text-orange-500 text-2xl font-bold mb-2">Tag error</h1>
                </div>
            )}
            </div>
            <div className="my-1 flex w-full flex-wrap  items-center">
              {selectedTags.map((tag) => (
                <div
                  key={tag.id}
                  className="m-2 flex items-center justify-center space-x-2 whitespace-nowrap rounded-2xl bg-orange-300/50 px-2.5 py-1"
                >
                  <div>{tag.name}</div>
                  <FaTimes
                    onClick={() =>
                      setSelectedTags((prev) =>
                        prev.filter((currentTag) => currentTag.id !== tag.id)
                      )
                    }
                    className="cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative flex flex-col items-center justify-center"
        >
          {createPost.isLoading && (
            <div className="absolute flex h-full w-full items-center">
              <AiOutlineLoading3Quarters className="animate-spin text-orange-400" />
            </div>
          )}

          <input
            type="text"
            id="title"
            className="h-full w-full rounded-xl border border-orange-300 p-4 focus:border-orange-500 focus:outline-none"
            placeholder="Title of the Post"
            {...register("title")}
          />
          <p className="mb-4 w-full text-left text-sm text-red-500">
            {errors.title?.message}
          </p>

          <input
            type="text"
            id="shortDescription"
            className="h-full w-full rounded-xl border border-orange-300 p-4 focus:border-orange-500 focus:outline-none"
            placeholder="Short description of the Post"
            {...register("description")}
          />
          <p className="mb-4 w-full text-left text-sm text-red-500">
            {errors.description?.message}
          </p>
          <div className="text-orange-400">
            <button
              type="button"
              className="flex items-center space-x-3 rounded border px-4 py-2 transition hover:border-orange-400"
              onClick={() => setIsPhotoModalOpen(true)}
            >
              {isPhotoUploaded ? <AiOutlineCheck /> : <BiImage />}
              <div>{isPhotoUploaded ? "Picture Uploaded" : "Upload Photo"}</div>
            </button>
          </div>
          <div className="text-orange-400">
            <button
              type="submit"
              className="flex items-center space-x-3 rounded border px-4 py-2 transition hover:border-orange-400"
            >
              <BiPencil />
              <div>Create Post</div>
            </button>
          </div>
        </form>

        <PhotoSelectionModal
          isOpen={isPhotoModalOpen}
          onClose={() => setIsPhotoModalOpen(false)}
          onSelect={(paintingId) => {
            setPaintingId(paintingId);
            setIsPhotoModalOpen(false);
            setIsPhotoUploaded(true);
          }}
        />
      </Modal>
    </>
  );
};

export default WriteFormModal;
