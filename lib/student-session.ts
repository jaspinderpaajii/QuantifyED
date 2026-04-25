import { createHmac, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getStudentById } from "@/lib/data";
import type { StudentAccount } from "@/lib/types";

const studentSessionCookie = "quantifyed_student_session";
const sessionMaxAgeSeconds = 60 * 60 * 24 * 30;

type StudentSessionPayload = {
  studentId: string;
  email: string;
  expiresAt: number;
};

export type StudentSession = StudentAccount;

function getSessionSecret() {
  return (
    process.env.AUTH_SECRET ??
    process.env.NEXTAUTH_SECRET ??
    "quantifyed-local-student-session-secret"
  );
}

function base64UrlEncode(value: Buffer | string) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlDecode(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(normalized, "base64").toString("utf8");
}

function signValue(value: string) {
  return base64UrlEncode(
    createHmac("sha256", getSessionSecret()).update(value).digest(),
  );
}

function signaturesMatch(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

function createStudentToken(payload: StudentSessionPayload) {
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = signValue(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

function parseStudentToken(token: string) {
  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = signValue(encodedPayload);

  if (!signaturesMatch(signature, expectedSignature)) {
    return null;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as
      | StudentSessionPayload
      | undefined;

    if (!payload?.studentId || payload.expiresAt < Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function getStudentSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(studentSessionCookie)?.value;

  if (!token) {
    return null;
  }

  const payload = parseStudentToken(token);

  if (!payload) {
    return null;
  }

  return getStudentById(payload.studentId);
}

export async function requireStudentSession() {
  const student = await getStudentSession();

  if (!student) {
    redirect("/student/login");
  }

  return student;
}

export async function setStudentSession(student: StudentAccount) {
  const cookieStore = await cookies();
  const token = createStudentToken({
    studentId: student.id,
    email: student.email,
    expiresAt: Date.now() + sessionMaxAgeSeconds * 1000,
  });

  cookieStore.set(studentSessionCookie, token, {
    httpOnly: true,
    maxAge: sessionMaxAgeSeconds,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearStudentSession() {
  const cookieStore = await cookies();
  cookieStore.delete(studentSessionCookie);
}
