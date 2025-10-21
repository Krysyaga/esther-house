export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image?: string;
  price: number;
  category: "concert" | "theatre" | "exposition" | "autre";
  capacity: number;
  ticketsSold: number;
  createdAt: string;
  updatedAt: string;
}

export interface Ticket {
  id: string;
  eventId: string;
  quantity: number;
  totalPrice: number;
  status: "pending" | "completed" | "cancelled";
  userEmail: string;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "new" | "read" | "replied";
  createdAt: string;
}
