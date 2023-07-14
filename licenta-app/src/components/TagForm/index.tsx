import React, { useState, useEffect } from "react";
import { trpc } from "../../utils/trpc";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "../Modal";
import { useForm } from "react-hook-form";
import { BsTagsFill } from "react-icons/bs";
import { z } from "zod";

type TagFormProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const tagCreateSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(3),
});

const TagForm = ({ isOpen, onClose }: TagFormProps) => {
  const [showSection, setShowSection] = useState(true);

  const makeShowSectionTrue = () => {
    setShowSection(true);
  };

  useEffect(() => {
    makeShowSectionTrue();
    setShowMore(true)
  }, []);

  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm<{
    name: string;
    description: string;
  }>({
    resolver: zodResolver(tagCreateSchema),
  });
  const postRoute = trpc.useContext().tag;
  const createTag = trpc.tag.createTag.useMutation({
    onSuccess: () => {
      toast.success("tag created successfully! 🏷️");
      reset();
      onClose();
      postRoute.getTags.invalidate();
    },
  });
  const [showMore, setShowMore] = useState(true); 

  return (
    <>
      {showSection ? (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Tag">
          <form
            onSubmit={handleSubmit((data) => createTag.mutate(data))}
            className="pt-4"
          >
            <input
              type="text"
              id="name"
              className="h-full w-full rounded-xl border border-orange-300 p-4 focus:border-orange-500 focus:outline-none"
              placeholder="Name of the tag:"
              {...register("name")}
            />
            <p className="mb-4 w-full text-left text-sm text-red-500">
              {errors.name?.message}
            </p>
            <input
              type="text"
              id="description"
              className="h-full w-full rounded-xl border border-orange-300 p-4 focus:border-orange-500 focus:outline-none"
              placeholder="Description of the tag:"
              {...register("description")}
            />
            <p className="mb-4 w-full text-left text-sm text-red-500">
              {errors.description?.message}
            </p>
            <></>
            {showMore && (
            <div className="flex w-full items-center text-orange-400">
              <button
                className="flex space-x-3 rounded border
              bg-orange-100/50 px-4 py-2 shadow-md transition hover:border-orange-400"
                type="submit"
              >
                <div>
                  <BsTagsFill />
                </div>
                <div className="text-sm">Add New Tag</div>
              </button>
            </div> )}
            {!showMore && (
                <div className="border-2 border-orange-400 p-4 rounded-md bg-gray-100 shadow-lg">
                    <h1 className="text-orange-500 text-2xl font-bold mb-2">Tag error</h1>
                </div>
            )}
          </form>
        </Modal>
      ) : (
        <></>
      )}
    </>
  );
};

export default TagForm;
