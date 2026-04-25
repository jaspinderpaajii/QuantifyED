export type ActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export const emptyActionState: ActionState = {
  status: "idle",
};
