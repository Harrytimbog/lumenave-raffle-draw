"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Form from "../components/Form";

const createStaff = () => {
  const router = useRouter();

  const [submitting, setIsSubmitting] = useState(false);
  const [post, setPost] = useState({ name: "" });

  const createStaff = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/staff/new", {
        method: "POST",
        body: JSON.stringify({
          name: post.name,
        }),
      });

      if (response.ok) {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form
      type="Create"
      post={post}
      setPost={setPost}
      submitting={submitting}
      handleSubmit={createStaff}
    />
  );
};

export default createStaff;
