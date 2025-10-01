import apiClient from '../utils/apiClient.jsx';

export class Restaurant {
  static async list(params = {}) {
    // Simulate restaurants
    return [
      {
        id: "r1",
        name: "Pizza Palace",
        description: "Best pizza in town!",
        image_url: "https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?w=400",
        rating: 4.7,
        delivery_time: "30-40 min",
        delivery_fee: 2.99,
        min_order: 15,
        is_active: true,
        is_featured: true,
        category_id: "1",
        address: "123 Main St",
        phone: "555-1234"
      },
      {
        id: "r2",
        name: "Burger Bonanza",
        description: "Juicy burgers and more.",
        image_url: "https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?w=400",
        rating: 4.5,
        delivery_time: "25-35 min",
        delivery_fee: 1.99,
        min_order: 10,
        is_active: true,
        is_featured: false,
        category_id: "2",
        address: "456 Burger Ave",
        phone: "555-5678"
      },
      {
        id: "r3",
        name: "Sushi Central",
        description: "Fresh sushi delivered fast.",
        image_url: "https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?w=400",
        rating: 4.8,
        delivery_time: "20-30 min",
        delivery_fee: 3.49,
        min_order: 20,
        is_active: true,
        is_featured: true,
        category_id: "3",
        address: "789 Sushi Rd",
        phone: "555-9012"
      }
    ];
  }

  static async get(id) {
    const list = await this.list();
    return list.find(r => r.id === id);
  }
}
