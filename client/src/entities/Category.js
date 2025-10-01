export class Category {
  static async list() {
    // Simulate categories
    return [
      { id: "1", name: "Pizza", icon: "🍕" },
      { id: "2", name: "Burgers", icon: "🍔" },
      { id: "3", name: "Sushi", icon: "🍣" },
      { id: "4", name: "Desserts", icon: "🍩" },
      { id: "5", name: "Salads", icon: "🥗" }
    ];
  }
}
