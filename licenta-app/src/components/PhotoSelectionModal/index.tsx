import React from 'react'
import Modal from '../Modal';
import { trpc } from '../../utils/trpc';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useSession } from 'next-auth/react';

interface PhotoSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (id: string) => void;
}

const PhotoSelectionModal: React.FC<PhotoSelectionModalProps> = ({ isOpen, onClose, onSelect }) => {
    const { data: session } = useSession();
    const getPaintings = trpc.painting.getAllPaintings.useQuery(
        { userId: session?.user?.id as string },
        { enabled: !!session?.user?.id }
    );

  if(getPaintings.isLoading){
    return <div className='flex justify-center items-center'>
      <AiOutlineLoading3Quarters className='animate-spin text-orange-400'/>
    </div>
  }

  if(getPaintings.isError){
    return <div>Error loading paintings</div>
  }

  const paintings = getPaintings.data;
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className='grid grid-cols-3 gap-4'>
        {paintings.map((painting) => (
          <div key={painting.id} onClick={() => onSelect(painting.id)} className="cursor-pointer hover:border-2 hover:border-orange-400 rounded-lg">
            <img src={painting.image} alt="painting" className="w-full h-auto"/>
          </div>
        ))}
      </div>
    </Modal>
  );
}

export default PhotoSelectionModal;
