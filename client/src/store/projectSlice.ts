import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import type { Project } from "../interfaces/type";

const API_URL = "http://localhost:8080/projects";

export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (userId: number) => {
    const res = await axios.get(API_URL);
    return res.data.filter((p: any) =>
      p.members.some((m: any) => m.userId === userId && m.role === "Project owner")
    );
  }
);

export const addProject = createAsyncThunk<Project>(
  "projects/addProject",
  async (newProject: any, { rejectWithValue }) => {
    try {
      const res = await axios.get(API_URL);
      const projects = res.data;
      const nextId = projects.length > 0 ? projects[projects.length - 1].id + 1 : 1;

      const projectToAdd = { id: nextId, ...newProject };
      const response = await axios.post(API_URL, projectToAdd);
      toast.success("Thêm dự án thành công!");
      return response.data;
    } catch (error) {
      toast.error("Lỗi khi thêm dự án!");
      return rejectWithValue(error);
    }
  }
);

interface StateType {
    list: Project[];
    loading: boolean;
    error: string | null;
}

const initialState: StateType = {
  list: [],
  loading: false,
  error: null,
};

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchProjects.rejected, (state) => {
        state.loading = false;
        state.error = "Không tải được danh sách dự án";
      })
      .addCase(addProject.fulfilled, (state, action) => {
        state.list.push(action.payload);
      });
  },
});

export default projectSlice.reducer;
