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
  const onFormSubmit: SubmitHandler<IFormInput> = async (values) => {
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
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <div className="flex">
        <input
          aria-invalid={true}
          {...register("url", { required: true })}
          type="text"
          placeholder="Enter your url here..."
          className="bg-white border border-solid border-gray-200 w-full px-2 h-12 placeholder-gray-600 mt-4 focus:outline-none focus:ring-2 focus:ring-[#0078cc] rounded-lg"
        />

        <button className="mt-4 ml-[-100px] px-4 text-xl py-2 bg-[#0078cc] hover:bg-[#0096ff] text-white rounded-lg">
          Shorten
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
