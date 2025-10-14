import { useEffect, useState } from "react";
import Button from "./Button";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import type { Project } from "../interfaces/type";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Project) => void;
  initialData?: Project | null;
  existingProjects?: Project[];
}

const ProjectModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  existingProjects = [],
}: Props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | undefined>(undefined);
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setDescription(initialData.description || "");
      setImage(initialData.image || undefined);
    } else {
      setName("");
      setDescription("");
      setImage(undefined);
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(f);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedDesc = description.trim();

    const nameExists = existingProjects.some(
      (p) =>
        p.name.trim().toLowerCase() === trimmedName.toLowerCase() &&
        p.id !== initialData?.id
    );

    const newErrors: typeof errors = {};
    if (!trimmedName) newErrors.name = "Tên dự án không được để trống";
    else if (nameExists) newErrors.name = "Tên dự án đã tồn tại";
    else if (trimmedName.length < 3)
      newErrors.name = "Tên dự án phải có ít nhất 3 ký tự";

    if (!trimmedDesc) newErrors.description = "Mô tả dự án không được để trống";
    else if (trimmedDesc.length < 10)
      newErrors.description = "Mô tả dự án phải có ít nhất 10 ký tự";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    let uploadedImage = image;

    if (file) {
      try {
        uploadedImage = await uploadToCloudinary(file);
      } catch {
        alert("Lỗi khi upload hình ảnh");
        return;
      }
    }

    onSubmit({
      id: initialData?.id ?? "", 
      name: trimmedName,
      description: trimmedDesc,
      image: uploadedImage,
      members: initialData?.members || [],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[550px]">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-2xl font-medium">
            {initialData ? "Sửa dự án" : "Thêm dự án"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Tên */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Tên dự án
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tên dự án"
              className={`w-full border px-3 py-2 rounded mt-1 transition-colors duration-200 focus:outline-none ${
                errors.name
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-blue-500"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Hình ảnh */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Hình ảnh dự án
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border border-gray-300 px-3 py-2 rounded mt-1"
            />
            {image && (
              <img
                src={image}
                alt="Preview"
                className="w-full h-40 object-cover mt-3 rounded border"
              />
            )}
          </div>

          {/* Mô tả */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Mô tả dự án
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả dự án"
              className={`w-full h-24 border px-3 py-2 rounded mt-1 transition-colors duration-200 focus:outline-none ${
                errors.description
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-blue-500"
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description}
              </p>
            )}
          </div>

          {/* Hành động */}
          <div className="flex justify-end gap-2">
            <Button
              text="Hủy"
              className="bg-gray-400 text-white"
              onClick={onClose}
            />
            <Button
              text="Lưu"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              type="submit"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;
