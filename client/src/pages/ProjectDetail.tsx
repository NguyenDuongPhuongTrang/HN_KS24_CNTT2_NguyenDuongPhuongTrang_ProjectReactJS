import { useEffect, useState, Fragment } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Button from "../components/Button";
import Badge from "../components/Badge";
import MemberCard from "../components/MemberCard";
import TaskModal from "../components/TaskModal";
import AddMemberModal from "../components/AddMemberModal";
import MemberListModal from "../components/MemberListModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import MenuImage from "../assets/images/Vector.png";
import type { Project } from "../interfaces/type";
import { toast } from "react-toastify";

export const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [membersState, setMembersState] = useState<
    { name: string; email?: string; role: string }[]
  >([]);
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [isAddMemberModalOpen, setAddMemberModalOpen] = useState(false);
  const [isMemberListModalOpen, setMemberListModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({
    "To do": false,
    "In Progress": false,
    Pending: false,
    Done: false,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");

  // Lấy danh sách tất cả user
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:8080/users");
        setAllUsers(res.data);
      } catch {
        toast.error("Không thể tải danh sách người dùng");
      }
    };
    fetchUsers();
  }, []);

  // Lấy dữ liệu dự án
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/projects/${id}`);
        setProject(res.data);

        if (res.data.members && allUsers.length > 0) {
          const membersDetailed = res.data.members.map((m: any) => {
            const user = allUsers.find((u) => String(u.id) === String(m.userId));
            return {
              name: user ? user.userName : "Người dùng chưa xác định",
              email: user ? user.email : "",
              role: m.role,
            };
          });
          setMembersState(membersDetailed);
        }
      } catch {
        toast.error("Không thể tải chi tiết dự án");
      }
    };
    if (id) fetchProject();
  }, [id, allUsers]);

  // Lấy danh sách task
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/tasks?projectId=${id}`);
        const tasksWithNames = res.data.map((t: any) => {
          const user = allUsers.find((u) => String(u.id) === String(t.assigneeId));
          return {
            ...t,
            assigneeName: user ? user.userName : "Không xác định",
          };
        });
        setTasks(tasksWithNames);
      } catch {
        toast.error("Không thể tải danh sách nhiệm vụ");
      }
    };
    if (id && allUsers.length > 0) fetchTasks();
  }, [id, allUsers]);

  const handleSaveTask = async (data: any) => {
    try {
      const selectedUser = allUsers.find(
        (u) => u.userName === data.assignee || u.email === data.assignee
      );

      const payload = {
        projectId: id,
        taskName: data.name,
        assigneeId: selectedUser ? selectedUser.id : null,
        asignDate: data.start,
        dueDate: data.end,
        priority: data.priority,
        progress: data.progress,
        status: data.status,
      };

      if (data.id) {
        await axios.put(`http://localhost:8080/tasks/${data.id}`, payload);
        setTasks((prev) =>
          prev.map((t) =>
            t.id === data.id
              ? {
                  ...t,
                  taskName: data.name,
                  priority: data.priority,
                  progress: data.progress,
                  status: data.status,
                  asignDate: data.start,
                  dueDate: data.end,
                  assigneeName: selectedUser ? selectedUser.userName : "Không xác định",
                }
              : t
          )
        );
        toast.success("Cập nhật nhiệm vụ thành công");
      } else {
        const res = await axios.post("http://localhost:8080/tasks", payload);
        setTasks((prev) => [
          ...prev,
          {
            ...res.data,
            assigneeName: selectedUser ? selectedUser.userName : "Không xác định",
          },
        ]);
        toast.success("Thêm nhiệm vụ thành công");
      }

      setTaskModalOpen(false);
    } catch {
      toast.error("Lưu nhiệm vụ thất bại");
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${month} - ${day}`;
  };

  const handleDeleteTask = async () => {
    try {
      if (selectedTask) {
        await axios.delete(`http://localhost:8080/tasks/${selectedTask.id}`);
        setTasks((prev) => prev.filter((t) => t.id !== selectedTask.id));
        toast.success("Xóa nhiệm vụ thành công");
      }
      setDeleteModalOpen(false);
    } catch {
      toast.error("Xóa nhiệm vụ thất bại");
    }
  };

  const handleAddMember = async (data: { email: string; role: string }) => {
    const user = allUsers.find((u) => u.email === data.email);
    if (!user) {
      toast.error("Không tìm thấy người dùng trong hệ thống");
      return;
    }

    const memberExists = membersState.some((m) => m.email === data.email);
    if (memberExists) {
      toast.warn("Thành viên đã tồn tại trong dự án");
      return;
    }

    const newMember = { userId: user.id, role: data.role };
    try {
      const updatedMembers = [...(project?.members || []), newMember];
      await axios.put(`http://localhost:8080/projects/${id}`, {
        ...project,
        members: updatedMembers,
      });

      setProject((prev) => (prev ? { ...prev, members: updatedMembers } : prev));
      setMembersState((prev) => [
        ...prev,
        { name: user.userName, email: user.email, role: data.role },
      ]);
      toast.success("Thêm thành viên thành công");
    } catch {
      toast.error("Không thể thêm thành viên");
    }
  };

  const handleRemoveMember = async (email: string) => {
    try {
      const user = allUsers.find((u) => u.email === email);
      if (!user) {
        toast.error("Không tìm thấy người dùng này");
        return;
      }
      const updatedMembers = (project?.members || []).filter(
        (m: any) => String(m.userId) !== String(user.id)
      );
      await axios.put(`http://localhost:8080/projects/${id}`, {
        ...project,
        members: updatedMembers,
      });
      setProject((prev) => (prev ? { ...prev, members: updatedMembers } : prev));
      setMembersState((prev) => prev.filter((m) => m.email !== email));

      toast.success("Xóa thành viên thành công");
    } catch {
      toast.error("Không thể xóa thành viên");
    }
  };

  const toggleCollapse = (status: string) => {
    setCollapsed((prev) => ({ ...prev, [status]: !prev[status] }));
  };

  const getGroupedTasks = () => {
    let filtered = [...tasks];

    // Tìm kiếm
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.taskName.toLowerCase().includes(term) ||
          t.assigneeName.toLowerCase().includes(term)
      );
    }

    // Sắp xếp
    if (sortOption === "priority") {
    const priorityOrder: Record<string, number> = { "Thấp": 1, "Trung bình": 2, "Cao": 3 };
    filtered.sort((a, b) => {
      const pa = priorityOrder[a.priority] || 0;
      const pb = priorityOrder[b.priority] || 0;
      return pa - pb;
    });
  } else if (sortOption === "dueDate") {
    filtered.sort((a, b) => {
      const da = new Date(a.dueDate).getTime() || 0;
      const db = new Date(b.dueDate).getTime() || 0;
      return da - db;
    });
  }


    // Nhóm theo trạng thái
    return filtered.reduce((acc: any, t) => {
      const status = t.status || "To do";
      if (!acc[status]) acc[status] = [];
      acc[status].push(t);
      return acc;
    }, {});
  };

  const groupedTasks = getGroupedTasks();

  if (!project)
    return <div className="p-6 text-center text-gray-600 italic">Đang tải chi tiết dự án...</div>;

  return (
    <div className="p-6 w-11/12 mx-auto">
      {/* Header */}
      <div className="flex justify-between mb-6">
        <div className="flex-1 pr-60">
          <h1 className="text-2xl font-bold mb-3">{project.name}</h1>
          <div className="flex gap-6 text-sm text-gray-500">
            <img
              src={project.image || "https://via.placeholder.com/150"}
              alt="project"
              className="w-44 h-32 rounded-lg object-cover"
            />
            <p className="text-gray-700 leading-relaxed">{project.description}</p>
          </div>
        </div>

        {/* Members */}
        <div className="w-1/3 bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Thành viên</h2>
            <div className="flex items-center">
              <Button
                text="+ Thêm thành viên"
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-[#6C757D] mr-2"
                onClick={() => setAddMemberModalOpen(true)}
              />
              <button
                className="h-10 w-10 rounded-full bg-[#E2E3E5] flex justify-center items-center"
                onClick={() => setMemberListModalOpen(true)}
              >
                <img src={MenuImage} alt="menu" />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {membersState.length > 0 ? (
              membersState.slice(0, 2).map((m, i) => <MemberCard key={i} name={m.name} role={m.role} />)
            ) : (
              <p className="text-gray-500 italic text-sm">Chưa có thành viên.</p>
            )}
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-6 text-sm text-gray-500 mt-4 mb-4 items-center justify-between">
        <Button
          text="+ Thêm nhiệm vụ"
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => {
            setSelectedTask(null);
            setTaskModalOpen(true);
          }}
        />
        <div className="flex items-center gap-10">
          <select
            className="border rounded px-2 py-1"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="">Sắp xếp theo</option>
            <option value="priority">Độ ưu tiên</option>
            <option value="dueDate">Hạn chót</option>
          </select>

          <input
            type="text"
            placeholder="Tìm kiếm nhiệm vụ"
            className="border w-96 px-2 py-1 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Task List */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="font-semibold mb-3">Danh Sách Nhiệm Vụ</h2>
        <table className="w-full border-collapse border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-2 text-left">Tên Nhiệm Vụ</th>
              <th className="border px-2 py-2">Người Phụ Trách</th>
              <th className="border px-2 py-2">Ưu Tiên</th>
              <th className="border px-2 py-2">Ngày Bắt Đầu</th>
              <th className="border px-2 py-2">Hạn Chót</th>
              <th className="border px-2 py-2">Tiến độ</th>
              <th className="border px-2 py-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {["To do", "In Progress", "Pending", "Done"].map((status) => (
              <Fragment key={status}>
                <tr
                  className="bg-gray-50 font-medium cursor-pointer select-none"
                  onClick={() => toggleCollapse(status)}
                >
                  <td colSpan={7} className="px-2 py-2">
                    {collapsed[status] ? "▶" : "▼"} {status}
                  </td>
                </tr>
                {!collapsed[status] &&
                  groupedTasks[status]?.map((t: any) => (
                    <tr key={t.id} className="hover:bg-gray-50">
                      <td className="border px-2 py-2">{t.taskName}</td>
                      <td className="border px-2 py-2 text-center">{t.assigneeName}</td>
                      <td className="border px-2 py-2 text-center">
                        <Badge
                          text={t.priority}
                          color={
                            t.priority === "Cao"
                              ? "bg-red-500"
                              : t.priority === "Trung bình"
                              ? "bg-yellow-500"
                              : "bg-[#0DCAF0]"
                          }
                        />
                      </td>
                      <td className="border px-2 py-2 text-center text-blue-600">
                        {formatDate(t.asignDate)}
                      </td>
                      <td className="border px-2 py-2 text-center text-blue-600">
                        {formatDate(t.dueDate)}
                      </td>
                      <td className="border px-2 py-2 text-center">
                        <Badge
                          text={t.progress}
                          color={
                            t.progress === "Trễ hạn"
                              ? "bg-red-500"
                              : t.progress === "Có rủi ro"
                              ? "bg-yellow-500"
                              : "bg-green-700"
                          }
                        />
                      </td>
                      <td className="border px-2 py-2 text-center space-x-1">
                        <Button
                          text="Sửa"
                          className="text-black bg-yellow-500 hover:bg-yellow-600 text-sm"
                          onClick={() => {
                            setSelectedTask({
                              id: t.id,
                              name: t.taskName,
                              assignee: t.assigneeName,
                              priority: t.priority,
                              start: t.asignDate,
                              end: t.dueDate,
                              progress: t.progress,
                              status: t.status,
                            });
                            setTimeout(() => setTaskModalOpen(true), 0);
                          }}
                        />
                        <Button
                          text="Xóa"
                          className="bg-red-500 hover:bg-red-700 text-sm font-normal text-white"
                          onClick={() => {
                            setSelectedTask(t);
                            setDeleteModalOpen(true);
                          }}
                        />
                      </td>
                    </tr>
                  ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onSubmit={handleSaveTask}
        availableAssignees={membersState}
        initialData={selectedTask}
        existingTasks={tasks}
      />
      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setAddMemberModalOpen(false)}
        onSubmit={handleAddMember}
        availableMembers={allUsers.map((u) => ({
          email: u.email,
          name: u.userName,
        }))}
      />
      <MemberListModal
        isOpen={isMemberListModalOpen}
        onClose={() => setMemberListModalOpen(false)}
        members={membersState}
        onRemoveMember={handleRemoveMember}
      />
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteTask}
        taskName={selectedTask?.taskName}
      />
    </div>
  );
};
