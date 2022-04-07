import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import FormError from "./FormError";

interface IFormInput {
  url: string;
}

interface IAddLinkResponse {
  link: string;
  validUrl: boolean;
}

interface IAddLinkFormProps {
  setLink: any;
}

const AddLinkForm: React.FC<IAddLinkFormProps> = ({ setLink }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitSuccessful },
    getFieldState,
  } = useForm<IFormInput>();
  const [urlServerError, setUrlServerError] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const onFormSubmit: SubmitHandler<IFormInput> = async (values) => {
    setIsLoading(true);
    const res = await fetch("/api/addlink", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    var parsedResponse: IAddLinkResponse = await res.json();
    if (!parsedResponse.validUrl) {
      setUrlServerError("You must provide a valid URL");
    } else {
      setLink(parsedResponse.link);
      reset();
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <div className="flex flex-col md:flex-row py-3">
        <input
          aria-invalid={true}
          {...register("url", { required: true })}
          disabled={isLoading}
          type="text"
          placeholder="Enter your url here..."
          className="bg-white dark:bg-soft-dark text-black dark:text-gray-400 border-2 border-solid border-skrt-blue w-full md:w-9/12 px-2 h-12 placeholder-gray-600 dark:placeholder-gray-400 mt-4 focus:outline-none rounded-xl disabled:bg-gray-300 disabled:border-gray-300"
        />
        <button
          className="text-center inline-flex leading-6 text-sm w-full md:ml-2 md:w-3/12 font-semibold items-center py-2 mt-4 bg-skrt-blue hover:bg-skrt-blue-light text-white rounded-xl disabled:bg-[#10466d]"
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
            <p className="text-center">
              {isLoading ? "Shortening..." : "Shorten"}
            </p>
          </div>
        </button>
      </div>

      <FormError
        error={
          getFieldState("url").invalid && !isSubmitSuccessful
            ? "Please enter a URL"
            : ""
        }
      />
      <FormError error={urlServerError!} />
    </form>
  );
};

export default AddLinkForm;
