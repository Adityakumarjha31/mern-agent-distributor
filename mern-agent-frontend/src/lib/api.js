export async function loginAdmin(email, password) {
  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      // Handle invalid credentials (401, 400, etc.)
      return { success: false, message: data.message || "Invalid credentials" };
    }

    // On success, backend returns _id, name, email, token
    return { success: true, ...data };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "Server error" };
  }
}
