import apiClient from '../utils/apiClient.jsx';

export class Order {
  static async list(params = {}) {
    // Simulate restaurants
    return [
        {
  "name": "Order",
  "type": "object",
  "properties": {
    "restaurant_id": {
      "type": "string",
      "description": "Reference to restaurant"
    },
    "customer_name": {
      "type": "string",
      "description": "Customer name"
    },
    "customer_phone": {
      "type": "string",
      "description": "Customer phone"
    },
    "customer_address": {
      "type": "string",
      "description": "Delivery address"
    },
    "items": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "menu_item_id": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "price": {
            "type": "number"
          },
          "quantity": {
            "type": "number"
          },
          "total": {
            "type": "number"
          }
        }
      }
    },
    "subtotal": {
      "type": "number",
      "description": "Items subtotal"
    },
    "delivery_fee": {
      "type": "number",
      "description": "Delivery fee"
    },
    "total_amount": {
      "type": "number",
      "description": "Total order amount"
    },
    "status": {
      "type": "string",
      "enum": [
        "pending",
        "confirmed",
        "preparing",
        "on_the_way",
        "delivered",
        "cancelled"
      ],
      "default": "pending"
    },
    "payment_method": {
      "type": "string",
      "enum": [
        "cash",
        "card",
        "digital_wallet"
      ],
      "default": "cash"
    },
    "special_instructions": {
      "type": "string",
      "description": "Special delivery or cooking instructions"
    }
  },
  "required": [
    "restaurant_id",
    "customer_name",
    "customer_phone",
    "customer_address",
    "total_amount"
  ]
}
   ];
  }

  static async get(id) {
    const list = await this.list();
    return list.find(r => r.id === id);
  }
}
