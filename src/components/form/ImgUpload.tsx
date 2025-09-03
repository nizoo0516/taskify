"use client";
import { useState } from "react";
import { useRef } from "react";

import Button from "@/components/layout/Button";

export default function ImgUpload() {
  const [files, setFiles] = useState();
  const imgFileRef = useRef();

  const onClickInput = () => {
    imgFileRef.current.click();
  };

  return (
    <>
      <Button
        className="bg-brand-gray-200 text-brand-blue-500 h-[76px] w-[76px] border-0 text-2xl"
        onClick={onClickInput}
      >
        +
      </Button>
      <input ref={imgFileRef} type="file" accept="image/*" className="hidden" />
    </>
  );
}
