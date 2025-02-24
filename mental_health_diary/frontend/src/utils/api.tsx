const apiUrl = import.meta.env.VITE_API_URL;

const fetchData = async (endpoint: string, method: string = "GET", body?: any) => {
  const token = localStorage.getItem("access");
  
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${apiUrl}/${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401) {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("username");
    window.location.href = "/login"; // Redirect on unauthorized
  }

  return response.json();
};

// Authentication API
export const checkAuthStatus = () => fetchData("users/is_authenticated/");
export const loginUser = (username: string, password: string) => fetchData("users/login/", "POST", { username, password });
export const logoutUser = () => fetchData("users/logout/", "POST");

// Diary API
export const getDiaryData = () => fetchData("diary/data/");
export const createNote = (noteData: any) => fetchData("diary/create_note/", "POST", noteData);
export const getUserNotes = () => fetchData("diary/get_notes/");

// Analytics API
export const getNoteFrequency = (startDate: string, endDate: string) => fetchData(`analytics/note-frequency/?startDate=${startDate}&endDate=${endDate}`);
export const getMoodTrends = (startDate: string, endDate: string) => fetchData(`analytics/mood-trends/?startDate=${startDate}&endDate=${endDate}`);
export const getEmotionAnalysis = (type: string, startDate: string, endDate: string) => fetchData(`analytics/emotion-analysis/?type=${type}&startDate=${startDate}&endDate=${endDate}`);
export const getOldestNoteDate = () => fetchData('analytics/oldest-note/');