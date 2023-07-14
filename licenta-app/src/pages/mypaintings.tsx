import React from "react";
import MainLayout from "../layouts/MainLayout";
import { trpc } from "../utils/trpc";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface PaintingType {
  id: string;
  userId: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const MyPaintings = () => {
  const { data: session } = useSession();

  const allPaintings = trpc.painting.getAllPaintings.useQuery(
    { userId: session?.user?.id as string },
    { enabled: !!session?.user?.id }
  );

  return (
    <MainLayout>
      <div className="grid grid-cols-4 gap-4">
        {allPaintings.isLoading && (
          <div className="flex h-full w-full justify-center">
            <div>Loading...</div>
            <div>
              <AiOutlineLoading3Quarters className="animate-spin text-orange-400" />
            </div>
          </div>
        )}
        {allPaintings.isSuccess &&
          allPaintings.data?.map((painting: PaintingType) => (
            <div
              key={painting.id}
              className="w-150 relative m-2 h-80 overflow-hidden rounded-lg"
            >
              <Image
                src={painting.image}
                alt={`Painting ${painting.id + 1}`}
                layout="fill"
                objectFit="contain"
                className="absolute"
              />
            </div>
          ))}
      </div>
    </MainLayout>
  );
};

export default MyPaintings;
