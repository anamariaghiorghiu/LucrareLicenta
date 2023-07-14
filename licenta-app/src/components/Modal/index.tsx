import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}: React.PropsWithChildren<ModalProps>) {
  const [showModalContent, setShowModalContent] = useState(true);

  useEffect(() => {
    setShowModalContent(true);
  }, []);

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-400"
            enterFrom="opacity-0 scale-90"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-300"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div
              className="fixed inset-0"
              style={{ background: "rgba(255, 165, 0, 0.15)" }}
            />
          </Transition.Child>

          {!showModalContent && (
            <div className="rounded-md border-2 border-orange-400 bg-gray-100 p-4 shadow-lg">
              <h1 className="mb-2 text-2xl font-bold text-orange-500">
                Can't render the modal
              </h1>
              <p className="text-xl text-gray-700">Something went wrong</p>
            </div>
          )}

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-400"
                enterFrom="opacity-0 scale-90"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-300"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                {showModalContent ? (
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      {title}
                    </Dialog.Title>
                    {children}
                  </Dialog.Panel>
                ) : (
                  <div className="rounded-md border-2 border-orange-400 bg-gray-100 p-4 shadow-lg">
                    <h1 className="mb-2 text-2xl font-bold text-orange-500">
                      Can't render the modal content
                    </h1>
                    <p className="text-xl text-gray-700">
                      Something went wrong
                    </p>
                  </div>
                )}
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
