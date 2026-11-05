import React from "react";
import { ThreeDots } from "react-loader-spinner";
interface lodingPropsType {
  loadMsg : string |""
}
export default function Loading({loadMsg}:lodingPropsType) {
  return (
    <>
      (
      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-deep-black/85 backdrop-blur-sm"
        role="status"
        aria-live="polite"
      >
        <ThreeDots
          visible={true}
          height={45}
          width={80}
          color="#C8FF61"
          radius={9}
          ariaLabel="Creating account"
        />

        <p className="mt-4 text-acid-lime font-semibold">
          {loadMsg}
        </p>
      </div>
      )
    </>
  );
}
