const API_URL = "http://127.0.0.1:8000/login"; // Change if needed

// Test user credentials
const testUser = {
  email: "aaryamauu@example.com",   // Use a real user from your database
  password: "booboo"      // Use the correct password
};

// Function to test login
const testLogin = async () => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testUser),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Login failed");
    }

    console.log("✅ Login successful!");
    console.log("🔑 Access Token:", data.access_token);
  } catch (error) {
    console.error("❌ Login failed!");
    console.error("🔍 Error:", error.message);
  }
};

// Run the test
testLogin();
