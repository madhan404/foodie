export class MenuItem {
  static async list() {
    // Simulate menu items
    return [
      {
        id: "m1",
        restaurant_id: "r1",
        name: "Margherita Pizza",
        description: "Classic cheese & tomato pizza",
        price: 12.99,
        image_url: "https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?w=400",
        category: "Pizza",
        is_vegetarian: true,
        is_spicy: false,
        ingredients: ["Cheese", "Tomato", "Basil"],
        prep_time: "20 min"
      },
      {
        id: "m2",
        restaurant_id: "r2",
        name: "Cheeseburger",
        description: "Juicy beef patty with cheese",
        price: 10.99,
        image_url: "https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?w=400",
        category: "Burgers",
        is_vegetarian: false,
        is_spicy: false,
        ingredients: ["Beef", "Cheese", "Lettuce"],
        prep_time: "15 min"
      },
      {
        id: "m3",
        restaurant_id: "r3",
        name: "Salmon Sushi",
        description: "Fresh salmon over rice",
        price: 14.99,
        image_url: "https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?w=400",
        category: "Sushi",
        is_vegetarian: false,
        is_spicy: false,
        ingredients: ["Salmon", "Rice", "Seaweed"],
        prep_time: "10 min"
      }
      // Add more items as needed
    ];
  }
}
