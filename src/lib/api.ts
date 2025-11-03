// API base URL
const API_BASE_URL = "https://api.socialmat.cz";

// Auth response types
export interface AuthResponse {
  token: string;
  refreshToken: string;
  type: string;
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// API Response types
export interface Project {
  id: number;
  name: string;
  description: string;
  status: "UPLOADING" | "PROCESSING" | "COMPLETED" | "FAILED";
  originalVideoUrl: string;
  processedVideoUrl: string;
  subtitles: Subtitle[];
  createdAt: string;
  updatedAt: string;
  generatedDescription: string;
}

export interface Subtitle {
  id: number;
  startTime: number;
  endTime: number;
  text: string;
  sequenceNumber: number;
}

// ========================
// AUTH FUNCTIONS
// ========================

// Register new user
export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Registration failed");
  }

  const authResponse = await response.json();
  // Save token to localStorage
  localStorage.setItem("token", authResponse.token);
  localStorage.setItem("refreshToken", authResponse.refreshToken);
  return authResponse;
}

// Login user
export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Login failed");
  }

  const authResponse = await response.json();
  // Save token to localStorage
  localStorage.setItem("token", authResponse.token);
  localStorage.setItem("refreshToken", authResponse.refreshToken);
  return authResponse;
}

// Logout user
export function logout(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
}

// Get auth token from localStorage
export function getAuthToken(): string | null {
  return localStorage.getItem("token");
}

// Helper to add auth header to requests
function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

// ========================
// PROJECT FUNCTIONS
// ========================

// Create a new project
export async function createProject(
  name: string,
  description: string
): Promise<Project> {
  const response = await fetch(`${API_BASE_URL}/api/projects`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ name, description }),
  });

  if (!response.ok) {
    throw new Error("Failed to create project");
  }

  return response.json();
}

// Upload video to a project
export async function uploadVideo(
  projectId: number,
  videoFile: File
): Promise<void> {
  const formData = new FormData();
  formData.append("file", videoFile);

  const response = await fetch(
    `${API_BASE_URL}/api/projects/${projectId}/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to upload video");
  }
}

// Get project status
export async function getProjectStatus(projectId: number): Promise<Project> {
  const response = await fetch(
    `${API_BASE_URL}/api/projects/${projectId}/status`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to get project status");
  }

  return response.json();
}

// Get project subtitles
export async function getSubtitles(projectId: number): Promise<Subtitle[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/projects/${projectId}/subtitles`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to get subtitles");
  }

  return response.json();
}

// Convert subtitles to SRT format
export function convertToSRT(subtitles: Subtitle[]): string {
  return subtitles
    .sort((a, b) => a.sequenceNumber - b.sequenceNumber)
    .map((subtitle) => {
      const startTime = formatSRTTime(subtitle.startTime);
      const endTime = formatSRTTime(subtitle.endTime);
      return `${subtitle.sequenceNumber}\n${startTime} --> ${endTime}\n${subtitle.text}\n`;
    })
    .join("\n");
}

// Format time in milliseconds to SRT time format (HH:MM:SS,mmm)
function formatSRTTime(milliseconds: number): string {
  const hours = Math.floor(milliseconds / 3600000);
  const minutes = Math.floor((milliseconds % 3600000) / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  const ms = milliseconds % 1000;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")},${String(ms).padStart(3, "0")}`;
}
