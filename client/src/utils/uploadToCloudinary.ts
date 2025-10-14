export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "react_upload");

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/dqegpz4du/image/upload", 
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();
  return data.secure_url;
};
