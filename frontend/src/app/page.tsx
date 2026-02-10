"use client";
import { redirect } from "next/navigation";

export default function Home() {
  const handleClick = () => {
    redirect("/dashboard");
  };

  return (
    <>
      <button onClick={handleClick}>Click Me</button>
    </>
  );
}
