import api from "@/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface ExcelFile {
  fileName: string;
  Key: string;
  LastModified: string;
  ETag: string;
  Size: number;
  StorageClass: string;
}

interface FileState {
  files: ExcelFile[] | [];
  loading: boolean;
  error: string | null;
}

const initialState: FileState = {
  files: [],
  loading: false,
  error: null,
};

// Async thunk for fetching files from an API
// Async thunk for fetching files from an API
export const fetchFiles = createAsyncThunk<
  File[],
  void,
  { rejectValue: string }
>("files/fetchFiles", async (_, { rejectWithValue }) => {
  try {
    const admin_id = await AsyncStorage.getItem("id");
    const response = await api.post("/leads/getLeadFile", {
      id: admin_id,
    });

    return response; // Corrected line: return the data field of the response
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Something went wrong");
  }
});

const fileSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    setFiles: (state, action: PayloadAction<File[]>) => {
      state.files = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.files = action.payload;
      })
      .addCase(fetchFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch files";
      });
  },
});

export const { setFiles, setLoading, setError } = fileSlice.actions;

export default fileSlice.reducer;
