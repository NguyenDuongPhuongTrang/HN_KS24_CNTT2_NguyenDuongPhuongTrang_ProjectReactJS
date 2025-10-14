import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import Button from "../components/Button";
import Pagination from "../components/Pagination";
import ProjectModal from "../components/ProjectModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import type { Project } from "../interfaces/type";
import { useNavigate } from "react-router-dom";

const ProjectList = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 9;
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
    const user = localStorage.getItem("user");
    if (user) {
      setCurrentUserId(JSON.parse(user).id);
    }
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get("http://localhost:8080/projects");
      setProjects(res.data);
    } catch (err) {
      console.error("Lỗi tải dự án:", err);
      toast.error("Không thể tải danh sách dự án");
    }
  };

  const filteredProjects = projects
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter((p) =>
      p.members.some(
        (m) => m.userId === currentUserId && m.role === "Project owner"
      )
    );

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProjects = filteredProjects.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const handleAddProject = () => {
    setSelectedProject(null);
    setIsModalOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleDeleteProject = (project: Project) => {
    setSelectedProject(project);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedProject) return;

    try {
      await axios.delete(`http://localhost:8080/projects/${selectedProject.id}`);
      toast.success("Xóa dự án thành công!");
      fetchProjects();
    } catch (err) {
      toast.error("Lỗi khi xóa dự án");
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const handleSaveProject = async (data: Project) => {
    try {
      if (data.id) {
        await axios.put(`http://localhost:8080/projects/${data.id}`, data);
        toast.success("Cập nhật dự án thành công!");
      } else {
        if (!currentUserId) {
          toast.error("Không xác định được người dùng hiện tại!");
          return;
        }

        const newProject: Project = {
          ...data,
          id: uuidv4(),
          members: [{ userId: currentUserId, role: "Project owner" }],
        };

        await axios.post("http://localhost:8080/projects", newProject);
        toast.success("Thêm dự án thành công!");
      }

      fetchProjects();
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Lỗi khi lưu dự án");
    }
  };

  return (
    <div className="p-2 px-6">
      <div className="bg-white rounded-xl shadow-md p-6 min-h-[719px]">
        <h1 className="text-2xl font-semibold text-gray-800">
            Quản Lý Dự Án Nhóm
          </h1>
        
          <div className="flex gap-2 justify-between mt-7 mb-3">	
            <Button
              text="+ Thêm Dự Án"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded px-4 py-2"
              onClick={handleAddProject}
            />
            <input
              type="text"
              placeholder="Tìm kiếm dự án"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-96 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

        <h2 className="text-xl font-medium mb-2">Danh Sách Dự Án</h2>

        <table className="w-full border border-gray-200 text-sm">
          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="py-2 px-4 text-center w-36">ID</th>
              <th className="py-2 px-4 text-left">Tên Dự Án</th>
              <th className="py-2 px-4 text-center w-80">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {currentProjects.map((project, index) => (
              <tr
                key={project.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="py-2 px-4 text-center">{startIndex + index + 1}</td>
                <td className="py-2 px-4">{project.name}</td>
                <td className="py-2 px-4 text-center">
                  <div className="flex justify-center gap-2">
                    <Button
                      text="Sửa"
                      className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1 rounded"
                      onClick={() => handleEditProject(project)}
                    />
                    <Button
                      text="Xóa"
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      onClick={() => handleDeleteProject(project)}
                    />
                    <Button
                      text="Chi tiết"
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                      onClick={() => navigate(`/app/projects/${project.id}`)}
                    />
                  </div>
                </td>
              </tr>
            ))}

            {currentProjects.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="text-center py-3 text-gray-500 italic"
                >
                  Không có dự án nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              if (page >= 1 && page <= totalPages) setCurrentPage(page);
            }}
          />
        </div>

      {/* Modal thêm/sửa */}
      {isModalOpen && (
        <ProjectModal
          isOpen={isModalOpen}
          initialData={selectedProject}
          onSubmit={handleSaveProject}
          onClose={() => setIsModalOpen(false)}
          existingProjects={projects}
        />
      )}

      {/* Modal xác nhận xóa */}
      {isDeleteModalOpen && (
        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          projectName={selectedProject?.name}
          onConfirm={handleConfirmDelete}
          onClose={() => setIsDeleteModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ProjectList;
