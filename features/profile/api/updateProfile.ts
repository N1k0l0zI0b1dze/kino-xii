export type UpdateProfilePayload = {
  fullName: string;
  mobileNumber: string;
  dateOfBirth: string;
  preferredVenueId?: number;
  avatar?: File | null;
};

export const updateProfile = async ({
  fullName,
  mobileNumber,
  dateOfBirth,
  preferredVenueId,
  avatar,
}: UpdateProfilePayload) => {
  const formData = new FormData();

  formData.append("fullName", fullName);
  formData.append("mobileNumber", mobileNumber);
  formData.append("dateOfBirth", dateOfBirth);

  if (preferredVenueId !== undefined) {
    formData.append("preferredVenueId", String(preferredVenueId));
  }

  if (avatar) {
    formData.append("avatar", avatar);
  }

  const response = await fetch("/api/profile", {
    method: "PUT",
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
};
