import Button from "./Button";
import ConfirmDeleteModal from "./ConfirmDeleteModal"; 

interface MemberListModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: { name: string; email?: string; role: string }[];
  onRemoveMember?: (email: string) => void;
  onUpdateRole?: (email: string, newRole: string) => void;
}

const MemberListModal = ({ isOpen, onClose, members, onRemoveMember, onUpdateRole }: MemberListModalProps) => {
  if (!isOpen) return null;

  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);

  const handleDeleteClick = (email: string) => {
    setMemberToDelete(email);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (memberToDelete && onRemoveMember) {
      onRemoveMember(memberToDelete);
    }
    setIsConfirmOpen(false);
    setMemberToDelete(null);
  };

  const handleCloseConfirm = () => {
    setIsConfirmOpen(false);
    setMemberToDelete(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-[600px] rounded-xl p-5 shadow-lg max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-2 border-b pb-2">
          <h2 className="text-xl font-medium">Thành viên</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <span className="text-2xl">&times;</span>
          </button>
        </div>
        <div className="flex items-center justify-around p-3 rounded-lg text-xl">
          <p>Thành viên</p>
          <p>Vai trò</p>
        </div>

        {members.length === 0 ? (
          <p className="text-gray-500 italic text-center">Chưa có thành viên nào.</p>
        ) : (
          <div className="space-y-4">
            {members.map((m, i) => {
              const avatarColor = getRandomColor();
              return (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold`}
                      style={{ backgroundColor: avatarColor }}
                    >
                      {m.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{m.name}</p>
                      <p className="text-sm text-gray-500">{m.email || "-"}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={m.role}
                      onChange={(e) => {
                        if (m.email && onUpdateRole) {
                          onUpdateRole(m.email, e.target.value);
                        }
                      }}
                      className="border rounded px-2 py-1 text-sm w-40"
                      disabled={m.role === "Project owner"}
                    />
                    <button
                      className={`text-red-500 hover:text-red-700 ${m.role === "Project owner" ? "opacity-0 pointer-events-none" : ""}`}
                      onClick={() => handleDeleteClick(m.email || "")}
                    >
                      <span className="text-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                    </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <hr className="mt-3" />

        <div className="flex justify-end mt-4 space-x-2">
          <Button text="Đóng" className="bg-gray-300 hover:bg-gray-400 text-black" onClick={onClose} />
          <Button text="Lưu" className="bg-blue-500 hover:bg-blue-700 text-white" />
        </div>

        {/* Modal xác nhận xóa */}
        <ConfirmDeleteModal
          isOpen={isConfirmOpen}
          onClose={handleCloseConfirm}
          onConfirm={handleConfirmDelete}
          projectName={memberToDelete ? members.find(m => m.email === memberToDelete)?.name : undefined}
        />
      </div>
    </div>
  );
};

// Đảm bảo thêm useState nếu bạn dùng React
import { useState } from "react";

export default MemberListModal;