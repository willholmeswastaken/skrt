import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Rings } from "react-loader-spinner";
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
  const [isLoading, setIsLoading] = useState<boolean>();
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
          className="mt-4 ml-[-100px] px-4 text-xl py-2 bg-[#0078cc] hover:bg-[#0096ff] text-white rounded-lg disabled:bg-[#10466d]"
          disabled={isLoading}
        >
          Shorten
        </button>
      </div>
      {isLoading && (
        <div className="flex items-center justify-center">
          <Rings color="#0078cc" height={110} width={110} />
        </div>
      )}

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
