export class User {
  static async me() {
    // Simulate user session
    const user = localStorage.getItem("foodie_user");
    if (!user) throw new Error("Not authenticated");
    return JSON.parse(user);
  }

  static async loginWithRedirect(redirectUrl) {
    // Simulate login
    localStorage.setItem("foodie_user", JSON.stringify({ id: "1", name: "Demo User" }));
    window.location.href = redirectUrl;
  }
}
