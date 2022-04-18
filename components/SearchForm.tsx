import React, { useState } from "react";
import { NextRouter, useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import FormError from "./FormError";

interface IFormInput {
  linkId: string;
}

interface ISearchFormProps {
  onDismiss: () => void;
}

const SearchForm = ({ onDismiss }: ISearchFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful },
    getFieldState,
  } = useForm<IFormInput>();
  const router: NextRouter = useRouter();
  const [searchError, setSearchError] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onFormSubmit: SubmitHandler<IFormInput> = async ({ linkId }) => {
    setIsLoading(true);
    const res = await fetch(`/api/searchlink?linkId=${linkId}`);
    switch (res.status) {
      case 404:
        setSearchError("Please provide an existing link id");
        break;
      case 400:
        setSearchError("Please provide a link id");
        break;
      case 200:
        router.push(`/analytics/${linkId}`);
        onDismiss();
        break;
    }
    setIsLoading(false);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <div className="flex flex-col py-3">
        <input
          aria-invalid={true}
          {...register("linkId", { required: true })}
          disabled={isLoading}
          type="text"
          placeholder="Enter your link id here..."
          className="bg-white dark:bg-soft-dark text-black dark:text-gray-400 border-2 border-solid border-skrt-blue w-full px-2 h-12 placeholder-gray-600 dark:placeholder-gray-400 mt-4 focus:outline-none rounded-xl disabled:bg-gray-300 disabled:border-gray-300"
        />
        <FormError
          error={
            getFieldState("linkId").invalid && !isSubmitSuccessful
              ? "Please enter a link id"
              : ""
          }
        />
        <FormError error={searchError!} />
        <div className="flex flex-col md:flex-row">
          <button
            className="text-center inline-flex leading-6 text-sm w-full font-semibold items-center py-2 mt-4 bg-soft-dark-light text-white rounded-xl"
            type="button"
            onClick={onDismiss}
          >
            <div className="w-full flex items-center justify-center">
              <p className="text-center">Dismiss</p>
            </div>
          </button>
          <button
            className="text-center inline-flex leading-6 text-sm w-full md:ml-2 font-semibold items-center py-2 mt-4 bg-skrt-blue hover:bg-skrt-blue-light text-white rounded-xl"
            disabled={isLoading}
          >
            <div className="w-full flex items-center justify-center">
              {isLoading && (
                <svg
                  className={`motion-reduce:hidden animate-spin -ml-1 mr-3 h-5 w-5 text-white`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              <p className="text-center">{isLoading ? "" : "Search"}</p>
            </div>
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchForm;
