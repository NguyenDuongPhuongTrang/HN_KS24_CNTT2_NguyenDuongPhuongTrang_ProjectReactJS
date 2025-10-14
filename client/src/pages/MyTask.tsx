import { useEffect, useState, Fragment } from "react";
import axios from "axios";
import Badge from "../components/Badge";
import type { Project } from "../interfaces/type";
import type { Task } from "../interfaces/type";

const MyTask = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [userId, setUserId] = useState<string | number>("");
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("status"); 

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUserId(parsed.id);
    }
  }, []);

  useEffect(() => {
    axios.get("http://localhost:8080/projects").then((res) => setProjects(res.data));
    axios.get("http://localhost:8080/tasks").then((res) => setTasks(res.data));
  }, []);

  const myProjects = projects.filter((p) =>
    p.members?.some((m) => String(m.userId) === String(userId))
  );

  const myTasks = tasks.filter((t) =>
    myProjects.some((p) => p.id === t.projectId)
  );

  const filteredTasks = myTasks.filter((t) =>
    t.taskName.toLowerCase().includes(search.toLowerCase())
  );

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortOption === "priority") {
      const order: Record<string, number> = { "Thấp": 1, "Trung bình": 2, "Cao": 3 };
      return order[a.priority] - order[b.priority];
    } else if (sortOption === "dueDate") {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else if (sortOption === "status") {
      const statusOrder: Record<string, number> = {
        "To do": 1,
        "In Progress": 2,
        "Pending": 3,
        "Done": 4,
      };
      return statusOrder[a.status] - statusOrder[b.status];
    }
    return 0;
  });

  const groupedTasks = myProjects.map((proj) => ({
    projectId: proj.id,
    projectName: proj.name,
    tasks: sortedTasks.filter((t) => t.projectId === proj.id),
  }));

  const toggleCollapse = (projectId: string) => {
    setCollapsed((prev) => ({ ...prev, [projectId]: !prev[projectId] }));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, "0")} - ${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;
};


  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Quản lý dự án</h1>

      {/* Thanh tìm kiếm và chọn sắp xếp */}
      <div className="flex items-center gap-10 justify-end">
        <select
          className="border rounded px-2 py-1"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="status">Sắp xếp theo trạng thái</option>
          <option value="priority">Sắp xếp theo độ ưu tiên</option>
          <option value="dueDate">Sắp xếp theo hạn chót</option>
        </select>
        <input
          type="text"
          placeholder="Tìm kiếm nhiệm vụ"
          className="border w-96 px-2 py-1 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Bảng nhiệm vụ */}
      <div className="bg-white rounded-lg shadow p-4 mt-6">
        <table className="w-full border-collapse border text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="border px-3 py-2 text-left w-1/3">Tên Nhiệm Vụ</th>
              <th className="border px-3 py-2 text-center w-24">Độ ưu tiên</th>
              <th className="border px-3 py-2 text-center w-32">Trạng thái</th>
              <th className="border px-3 py-2 text-center w-28">Ngày Bắt Đầu</th>
              <th className="border px-3 py-2 text-center w-28">Hạn Chót</th>
              <th className="border px-3 py-2 text-center w-32">Tiến độ</th>
            </tr>
          </thead>

          <tbody>
            {groupedTasks.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  Không có nhiệm vụ nào.
                </td>
              </tr>
            )}

            {groupedTasks.map((group) => (
              <Fragment key={group.projectId}>
                {/* Nhóm dự án */}
                <tr
                  className="bg-gray-50 font-semibold cursor-pointer text-gray-800"
                  onClick={() => toggleCollapse(group.projectId)}
                >
                  <td colSpan={6} className="px-3 py-2">
                    {collapsed[group.projectId] ? "▶" : "▼"} {group.projectName}
                  </td>
                </tr>

                {/* Danh sách nhiệm vụ */}
                {!collapsed[group.projectId] &&
                  group.tasks.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50">
                      <td className="border px-3 py-2">{t.taskName}</td>
                      <td className="border px-3 py-2 text-center">
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
                      <td className="border px-3 py-2 text-center">{t.status}</td>
                      <td className="border px-3 py-2 text-center text-blue-600">
                        {formatDate(t.asignDate)}
                      </td>
                      <td className="border px-3 py-2 text-center text-blue-600">
                        {formatDate(t.dueDate)}
                      </td>
                      <td className="border px-3 py-2 text-center">
                        <Badge
                          text={t.progress}
                          color={
                            t.progress === "Đúng tiến độ"
                              ? "bg-green-600"
                              : t.progress === "Có rủi ro"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }
                        />
                      </td>
                    </tr>
                  ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyTask;
