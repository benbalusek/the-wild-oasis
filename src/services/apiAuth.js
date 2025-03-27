import supabase, { supabaseUrl } from "./supabase";

export async function signup({ fullName, email, password }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { fullName, avatar: "" } },
  });

  if (error) throw new Error(error.message);
  return data;
}

export async function login({ email, password }) {
  let { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);
  return data;
}

export async function getCurrentUser() {
  const { data: session, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError) throw new Error(sessionError.message);
  if (!session?.session) return null;

  const { data, error: userError } = await supabase.auth.getUser();

  if (userError) throw new Error(userError.message);
  return data?.user;
}

export async function logout() {
  const { error: logoutError } = await supabase.auth.signOut();
  if (logoutError) throw new Error(logoutError.message);
}

export async function updateCurrentUser({ password, fullName, avatar }) {
  // 1. Update password OR fullName
  let updateData;
  if (password) updateData = { password };
  if (fullName) updateData = { data: { fullName } };

  const { data, error: dataUpdateError } = await supabase.auth.updateUser(
    updateData
  );

  if (dataUpdateError) throw new Error(dataUpdateError.message);
  console.log(
    "Uploaded image",
    data.user.user_metadata.avatar?.split("/").at(-1)
  );
  if (!avatar) return data;

  // 2. Upload the avatar image
  const fileName = `avatar-${data.user.id}-${Math.random()}`;
  const hasImage = data.user.user_metadata.avatar;

  // delete the already present image
  if (hasImage) {
    const existingFilePath = data.user.user_metadata.avatar.split("/")?.at(-1);

    const { data: imageDeleteData, error: imageDeleteError } =
      await supabase.storage.from("avatars").remove([existingFilePath]);

    if (imageDeleteError) throw new Error(imageDeleteError.message);
    console.log("Deleted image", imageDeleteData);
  }

  const { error: storageError } = await supabase.storage
    .from("avatars")
    .upload(fileName, avatar);
  if (storageError) throw new Error(storageError.message);

  // 3. Update avatar in the user
  const { data: updatedUser, error: updatedUserError } =
    await supabase.auth.updateUser({
      data: {
        avatar: `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`,
      },
    });
  if (updatedUserError) throw new Error(updatedUserError.message);
  return updatedUser;
}
