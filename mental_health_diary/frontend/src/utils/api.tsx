const API_URL = "http://127.0.0.1:8000/api";

const fetchData = async (endpoint: string, method: string = "GET", body?: any) => {
  const headers: HeadersInit = { 
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("access")}`
  };

  const response = await fetch(`${API_URL}/${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  return response.json();
};

export const getDiaryData = () => fetchData("diary/data/");
export const createNote = (noteData: any) => fetchData("diary/create_note/", "POST", noteData);
export const getUserData = () => fetchData("users/user_data");
export const loginUser = (username: string, password: string) => fetchData("users/login", "POST", { username, password });