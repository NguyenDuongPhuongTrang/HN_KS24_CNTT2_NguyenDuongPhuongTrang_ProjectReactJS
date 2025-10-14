import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { User, AuthState } from "../interfaces/type";

const initialState: AuthState = {
  user: [],
  error: null,
};

// Đăng ký
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData: User, { rejectWithValue }) => {
    try {
      const res = await axios.get("http://localhost:8080/users");
      const users = res.data;

      const newId = users.length > 0 ? users[users.length - 1].id + 1 : 1;

      const newUser = { id: newId, ...userData };
      await axios.post("http://localhost:8080/users", newUser);

      return newUser;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Đăng nhập
export const loginUser = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: string }
>("auth/loginUser", async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.get("http://localhost:8080/users", {
      params: { email: credentials.email },
    });

    const users = response.data;
    if (users.length === 0) {
      return rejectWithValue("Email chưa được đăng ký");
    }

    const user = users[0];
    if (user.password !== credentials.password) {
      return rejectWithValue("Mật khẩu không chính xác");
    }

    return user;
  } catch (error) {
    return rejectWithValue("Lỗi kết nối server");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    // Đăng ký
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = [...state.user, action.payload];
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })

    // Đăng nhập
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = [action.payload];
        state.error = null;
        localStorage.setItem("currentUser", JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default authSlice.reducer;
