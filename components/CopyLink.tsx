import { CheckIcon, ClipboardIcon } from "@heroicons/react/outline";
import React, { useState } from "react";

interface ICopyLinkProps {
  link: string;
}

const CopyLink = ({ link }: ICopyLinkProps) => {
  const [copied, setCopied] = useState<boolean>(false);

  const copyLink = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
  };
  return (
    <div
      onClick={() => copyLink()}
      className="mt-[-3px] hover:cursor-pointer text-soft-dark-caption-text dark:text-soft-white-header"
    >
      {copied ? <CheckIcon height={25} /> : <ClipboardIcon height={25} />}
    </div>
  );
};

export default CopyLink;
