import type { SignupFormValues } from "../schemas/signupSchema";

type RegisterPayload = SignupFormValues & {
  avatar?: File | null;
};

export const registerUser = async ({
  username,
  email,
  password,
  confirmPassword,
  avatar,
}: RegisterPayload) => {
  const formData = new FormData();

  formData.append("username", username);
  formData.append("email", email);
  formData.append("password", password);
  formData.append("password_confirmation", confirmPassword);

  if (avatar) {
    formData.append("avatar", avatar);
  }

  const response = await fetch("/api/register", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
};
