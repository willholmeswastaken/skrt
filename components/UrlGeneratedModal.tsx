import React, { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { BadgeCheckIcon } from "@heroicons/react/solid";
import CopyLink from "./CopyLink";

interface IUrlGeneratedModalProps {
  link: string;
}

const UrlGeneratedModal = ({ link }: IUrlGeneratedModalProps) => {
  const [open, setOpen] = useState<boolean>(true);

  useEffect(() => {
    setOpen(true);
  }, [link]);

  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-72 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="relative inline-block align-bottom dark:bg-soft-dark-light bg-soft-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="dark:bg-soft-dark-light bg-soft-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-center sm:flex-col">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-16 sm:w-16">
                    <BadgeCheckIcon
                      className="h-6 w-6 sm:h-12 sm:w-12 text-green-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:ml-4">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-soft-dark-caption-text dark:text-soft-white-header"
                    >
                      Url, Shortened.
                    </Dialog.Title>
                    <div className="mt-2 flex flex-col items-center">
                      <div className="hover:cursor-pointer flex flex-row">
                        <a
                          href={link}
                          className="text-[#0078cc] pr-2 focus:outline-none"
                        >
                          {link}
                        </a>
                        <CopyLink link={link} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 sm:px-6 sm:flex sm:items-center sm:justify-center">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-24 py-2 bg-skrt-blue hover:bg-skrt-blue-light text-base font-medium text-white focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setOpen(false)}
                >
                  Thanks!
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default UrlGeneratedModal;
