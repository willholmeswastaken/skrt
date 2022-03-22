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
      <div className="flex">
        <input
          aria-invalid={true}
          {...register("url", { required: true })}
          disabled={isLoading}
          type="text"
          placeholder="Enter your url here..."
          className="bg-white border border-solid border-gray-200 w-full px-2 h-12 placeholder-gray-600 mt-4 focus:outline-none focus:ring-2 focus:ring-[#0078cc] rounded-lg disabled:bg-gray-300 disabled:border-gray-300"
        />
        <button
          className="mt-4 w-40 text-center inline-flex leading-6 text-sm ml-[-100px] px-4 font-semibold items-center py-2 bg-[#479ed3] shadow-lg hover:bg-[#479ed3] text-white rounded-lg disabled:bg-[#10466d]"
          disabled={isLoading}
        >
          <svg
            className={`motion-reduce:hidden animate-spin -ml-1 mr-3 h-5 w-5 text-white ${isLoading ? '': 'invisible'}`}
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
          {isLoading ? "Shortening..." : "Shorten"}
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
