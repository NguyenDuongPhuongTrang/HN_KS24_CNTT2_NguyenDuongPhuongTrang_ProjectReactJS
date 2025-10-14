import { useState } from "react";
import Button from "./Button";

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { email: string; role: string }) => void;
  availableMembers: { email: string; name: string }[];
}

const AddMemberModal = ({ isOpen, onClose, onSubmit, availableMembers }: AddMemberModalProps) => {
  const [selectedEmail, setSelectedEmail] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmail || !role) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }
    setError("");
    onSubmit({ email: selectedEmail, role });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[550px]">
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-2xl font-medium">Thêm thành viên</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Thành viên</label>
            <select
              value={selectedEmail}
              onChange={(e) => { setSelectedEmail(e.target.value); setError(""); }}
              className="w-full border px-3 py-2 rounded mt-1"
            >
              <option value="">Chọn thành viên</option>
              {availableMembers.map((member) => (
                <option key={member.email} value={member.email}>
                  {member.name} ({member.email})
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Vai trò</label>
            <input
              type="text"
              value={role}
              onChange={(e) => { setRole(e.target.value); setError(""); }}
              className="w-full border px-3 py-2 rounded mt-1"
              placeholder="Project owner"
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button text="Hủy" className="bg-gray-400 text-white" onClick={onClose} />
            <Button text="Thêm" className="bg-blue-600 hover:bg-blue-700 text-white" type="submit" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberModal;