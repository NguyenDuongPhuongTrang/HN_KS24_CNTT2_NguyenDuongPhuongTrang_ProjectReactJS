import { useEffect, useState } from "react";
import Button from "./Button";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  availableAssignees: { name: string; email?: string; role?: string }[];
  initialData?: any;
  existingTasks?: any[]; 
}

const TaskModal = ({
  isOpen,
  onClose,
  onSubmit,
  availableAssignees,
  initialData,
  existingTasks = [],
}: TaskModalProps) => {
  const [formData, setFormData] = useState({
    id: undefined,
    name: "",
    assignee: "",
    priority: "Trung bình",
    start: "",
    end: "",
    progress: "Đúng tiến độ",
    status: "To do",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id || undefined,
        name: initialData.name || "",
        assignee: initialData.assignee || "",
        priority: initialData.priority || "Trung bình",
        start: initialData.start || "",
        end: initialData.end || "",
        progress: initialData.progress || "Đúng tiến độ",
        status: initialData.status || "To do",
      });
      setErrors({});
    } else {
      setFormData({
        id: undefined,
        name: "",
        assignee: "",
        priority: "Trung bình",
        start: "",
        end: "",
        progress: "Đúng tiến độ",
        status: "To do",
      });
      setErrors({});
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const today = new Date();
    const startDate = formData.start ? new Date(formData.start) : null;
    const endDate = formData.end ? new Date(formData.end) : null;

    // Trống
    if (!formData.name.trim()) newErrors.name = "Tên nhiệm vụ không được để trống";
    if (!formData.assignee) newErrors.assignee = "Vui lòng chọn người phụ trách";
    if (!formData.start) newErrors.start = "Vui lòng chọn ngày bắt đầu";
    if (!formData.end) newErrors.end = "Vui lòng chọn hạn chót";

    // Độ dài
    if (formData.name.length > 0 && formData.name.length < 5)
      newErrors.name = "Tên nhiệm vụ phải có ít nhất 5 ký tự";

    // Trùng tên
    const isDuplicate = existingTasks.some(
      (t) =>
        t.taskName.toLowerCase() === formData.name.toLowerCase() &&
        t.id !== formData.id
    );
    if (isDuplicate) newErrors.name = "Tên nhiệm vụ đã tồn tại";

    // Ngày bắt đầu > hôm nay
    if (startDate && startDate < new Date(today.setHours(0, 0, 0, 0)))
      newErrors.start = "Ngày bắt đầu phải lớn hơn hoặc bằng hôm nay";

    // Hạn chót > ngày bắt đầu
    if (startDate && endDate && endDate <= startDate)
      newErrors.end = "Hạn chót phải lớn hơn ngày bắt đầu";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[550px]">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-lg font-semibold mb-4">
            {formData.id ? "Sửa nhiệm vụ" : "Thêm nhiệm vụ"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Tên nhiệm vụ */}
          <div>
            <label className="block text-sm font-medium mb-1">Tên nhiệm vụ</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`border rounded w-full px-3 py-2 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Người phụ trách */}
          <div>
            <label className="block text-sm font-medium mb-1">Người phụ trách</label>
            <select
              name="assignee"
              value={formData.assignee}
              onChange={handleChange}
              className={`border rounded w-full px-3 py-2 ${
                errors.assignee ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">-- Chọn người phụ trách --</option>
              {availableAssignees.map((m, i) => (
                <option key={i} value={m.name}>
                  {m.name} ({m.role})
                </option>
              ))}
            </select>
            {errors.assignee && (
              <p className="text-red-500 text-sm mt-1">{errors.assignee}</p>
            )}
          </div>

          {/* Ưu tiên */}
          <div>
            <label className="block text-sm font-medium mb-1">Mức độ ưu tiên</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="border rounded w-full px-3 py-2"
            >
              <option value="Thấp">Thấp</option>
              <option value="Trung bình">Trung bình</option>
              <option value="Cao">Cao</option>
            </select>
          </div>

          {/* Ngày */}
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Ngày bắt đầu</label>
              <input
                type="date"
                name="start"
                value={formData.start}
                onChange={handleChange}
                className={`border rounded w-full px-3 py-2 ${
                  errors.start ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.start && <p className="text-red-500 text-sm mt-1">{errors.start}</p>}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Hạn chót</label>
              <input
                type="date"
                name="end"
                value={formData.end}
                onChange={handleChange}
                className={`border rounded w-full px-3 py-2 ${
                  errors.end ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.end && <p className="text-red-500 text-sm mt-1">{errors.end}</p>}
            </div>

          {/* Tiến độ */}
          <div>
            <label className="block text-sm font-medium mb-1">Tiến độ</label>
            <select
              name="progress"
              value={formData.progress}
              onChange={handleChange}
              className="border rounded w-full px-3 py-2"
            >
              <option value="Đúng tiến độ">Đúng tiến độ</option>
              <option value="Có rủi ro">Có rủi ro</option>
              <option value="Trễ hạn">Trễ hạn</option>
            </select>
          </div>

          {/* Trạng thái */}
          <div>
            <label className="block text-sm font-medium mb-1">Trạng thái</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border rounded w-full px-3 py-2"
            >
              <option value="To do">To do</option>
              <option value="In Progress">In Progress</option>
              <option value="Pending">Pending</option>
              <option value="Done">Done</option>
            </select>
          </div>

          <div className="flex justify-end mt-4 space-x-2">
            <Button
              text="Hủy"
              className="bg-gray-300 text-black hover:bg-gray-400"
              onClick={onClose}
            />
            <Button
              text="Lưu"
              type="submit"
              className="bg-blue-600 text-white hover:bg-blue-700"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
