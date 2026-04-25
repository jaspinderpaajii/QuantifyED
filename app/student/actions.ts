"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { compare, hash } from "bcryptjs";
import { z } from "zod";

import type { ActionState } from "@/lib/action-state";
import {
  createStudent,
  getStudentByEmail,
  toggleSavedResource,
} from "@/lib/data";
import {
  clearStudentSession,
  getStudentSession,
  setStudentSession,
} from "@/lib/student-session";

function readTextField(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function normalizeReturnTo(value: string) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/student/saved";
  }

  if (value.startsWith("/admin")) {
    return "/student/saved";
  }

  return value;
}

function revalidateReturnTo(returnTo: string) {
  const [pathname] = returnTo.split("?");
  revalidatePath(pathname || "/resources");
}

const loginSchema = z.object({
  email: z.string().trim().email("Use a valid student email."),
  password: z.string().min(1, "Enter your password."),
  returnTo: z.string().optional().default("/student/saved"),
});

const signupSchema = z
  .object({
    name: z.string().trim().min(2, "Use at least 2 characters for your name."),
    email: z.string().trim().email("Use a valid student email."),
    password: z.string().min(6, "Use at least 6 characters for your password."),
    confirmPassword: z.string().min(1, "Confirm your password."),
    returnTo: z.string().optional().default("/student/saved"),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export async function loginStudentAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: readTextField(formData, "email"),
    password: readTextField(formData, "password"),
    returnTo: readTextField(formData, "returnTo"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Could not sign you in.",
    };
  }

  const student = await getStudentByEmail(parsed.data.email);
  const passwordMatches = student
    ? await compare(parsed.data.password, student.passwordHash)
    : false;

  if (!student || !passwordMatches) {
    return {
      status: "error",
      message: "That email or password does not match a student account.",
    };
  }

  await setStudentSession({
    id: student.id,
    name: student.name,
    email: student.email,
    createdAt: student.createdAt,
    updatedAt: student.updatedAt,
  });

  redirect(normalizeReturnTo(parsed.data.returnTo));
}

export async function signupStudentAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = signupSchema.safeParse({
    name: readTextField(formData, "name"),
    email: readTextField(formData, "email"),
    password: readTextField(formData, "password"),
    confirmPassword: readTextField(formData, "confirmPassword"),
    returnTo: readTextField(formData, "returnTo"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Could not create the account.",
    };
  }

  try {
    const student = await createStudent({
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash: await hash(parsed.data.password, 10),
    });

    await setStudentSession(student);
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Could not create the account.",
    };
  }

  redirect(normalizeReturnTo(parsed.data.returnTo));
}

export async function toggleSavedResourceAction(formData: FormData) {
  const resourceId = readTextField(formData, "resourceId");
  const returnTo = normalizeReturnTo(readTextField(formData, "returnTo"));
  const student = await getStudentSession();

  if (!student) {
    redirect(`/student/login?next=${encodeURIComponent(returnTo)}`);
  }

  if (resourceId) {
    await toggleSavedResource(student.id, resourceId);
  }

  revalidatePath("/");
  revalidatePath("/resources");
  revalidatePath("/student/saved");
  revalidateReturnTo(returnTo);

  redirect(returnTo);
}

export async function logoutStudentAction() {
  await clearStudentSession();
  redirect("/");
}
