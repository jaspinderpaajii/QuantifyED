"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import type { ActionState } from "@/lib/action-state";
import { createContactInquiry } from "@/lib/contact";

const inquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name."),
  email: z.string().trim().email("Please enter a valid email address."),
  category: z.enum(["RESOURCE", "GUIDANCE", "TECHNICAL", "OTHER"]),
  message: z
    .string()
    .trim()
    .min(15, "Tell us a little more so we can understand your request."),
});

export async function submitContactAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = inquirySchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    category: formData.get("category"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Could not send your message.",
    };
  }

  await createContactInquiry(parsed.data);

  revalidatePath("/contact");
  revalidatePath("/admin/inquiries");

  return {
    status: "success",
    message: "Your message has been received. We can review it from the contact desk.",
  };
}
