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
  
    if (window.location.pathname !== "/login") {
      window.location.href = "/login"; // Redirect only if not already on login page
    }
  
    throw new Error("Unauthorized"); // Stop further execution
  }

  return response.json();
};

// Authentication API
export const checkAuthStatus = () => fetchData("users/is_authenticated/");
export const logoutUser = () => fetchData("users/logout/", "POST");
export const getUserData = (username: string) => fetchData(`users/user_data?username=${username}`);
export const changePassword = (oldPassword: string, newPassword: string, confirmPassword: string) =>
  fetchData("users/change_password/", "POST", { old_password: oldPassword, new_password: newPassword, confirm_password: confirmPassword });

// Diary API
export const getDiaryData = () => fetchData("diary/data/");
export const createNote = (noteData: any) => fetchData("diary/create_note/", "POST", noteData);
export const getUserNotes = () => fetchData("diary/get_notes/");
export const deleteNote = (noteId: number) => fetchData(`diary/delete_note/${noteId}/`, "DELETE");

// Analytics API
export const getNoteFrequency = (startDate: string, endDate: string) => fetchData(`analytics/note-frequency/?startDate=${startDate}&endDate=${endDate}`);
export const getMoodTrends = (startDate: string, endDate: string) => fetchData(`analytics/mood-trends/?startDate=${startDate}&endDate=${endDate}`);
export const getEmotionAnalysis = (type: string, startDate: string, endDate: string) => fetchData(`analytics/emotion-analysis/?type=${type}&startDate=${startDate}&endDate=${endDate}`);
export const getOldestNoteDate = () => fetchData('analytics/oldest-note/');

// ArtTherapy API
export const getLessons = () => fetchData("art_therapy/lessons/");
export const getLessonById = (id: string | number) => fetchData(`art_therapy/lessons/${id}/`);
export const toggleFavorite = (lessonId: number) => fetchData(`art_therapy/lessons/${lessonId}/favorite/`, "POST");
export const markCompleted = (lessonId: number) => fetchData(`art_therapy/lessons/${lessonId}/complete/`, "POST");

export const registerUser = async (formData: FormData) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/register/`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    return response.ok ? { success: true, data } : { success: false, message: data.error || "Registration failed" };
  } catch (error) {
    return { success: false, message: "An error occurred during registration" };
  }
};

export const loginUser = async (username: string, password: string) => {
  try {
    const response = await fetchData("users/login/", "POST", { username, password });

    if (response.access && response.refresh) {
      return { success: true, ...response };
    } else {
      return { success: false, message: response.error || "Login failed" };
    }
  } catch (error) {
    return { success: false, message: "An error occurred during login" };
  }
};