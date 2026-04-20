import { 
  MOCK_USERS, 
  MOCK_VEHICLES, 
  MOCK_APPOINTMENTS, 
  MOCK_INVOICES, 
  MOCK_SERVICES 
} from "./mock-data";

const STORAGE_KEYS = {
  USERS: "autohub_users",
  VEHICLES: "autohub_vehicles",
  APPOINTMENTS: "autohub_appointments",
  INVOICES: "autohub_invoices",
  SERVICES: "autohub_services",
  INITIALIZED: "autohub_initialized",
};

export class Storage {
  private static isBrowser = typeof window !== "undefined";

  static init() {
    if (!this.isBrowser) return;
    
    const initialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
    if (!initialized) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(MOCK_USERS));
      localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(MOCK_VEHICLES));
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(MOCK_APPOINTMENTS));
      localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(MOCK_INVOICES));
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(MOCK_SERVICES));
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, "true");
      console.log("Mock storage initialized with seed data");
    }
  }

  private static get<T>(key: string): T[] {
    if (!this.isBrowser) return [];
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private static set<T>(key: string, data: T[]) {
    if (!this.isBrowser) return;
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Users
  static getUsers() { return this.get<any>(STORAGE_KEYS.USERS); }
  static getStaff() {
    return this.getUsers().filter((u: any) => ["ADMIN", "STAFF"].includes(u.role));
  }
  static getUserByEmail(email: string) {
    return this.getUsers().find((u: any) => u.email === email);
  }

  // Vehicles
  static getVehicles() { return this.get<any>(STORAGE_KEYS.VEHICLES); }
  static getVehiclesByOwner(ownerId: string) {
    return this.getVehicles().filter((v: any) => v.ownerId === ownerId);
  }
  static addVehicle(vehicle: any) {
    const vehicles = this.getVehicles();
    const newVehicle = { ...vehicle, id: `v-${Date.now()}` };
    this.set(STORAGE_KEYS.VEHICLES, [...vehicles, newVehicle]);
    return newVehicle;
  }

  // Appointments
  static getAppointments() { return this.get<any>(STORAGE_KEYS.APPOINTMENTS); }
  static getAppointmentsByClient(clientId: string) {
    return this.getAppointments().filter((a: any) => a.clientId === clientId);
  }
  static addAppointment(appt: any) {
    const appts = this.getAppointments();
    const newAppt = { ...appt, id: `a-${Date.now()}`, createdAt: new Date().toISOString() };
    this.set(STORAGE_KEYS.APPOINTMENTS, [...appts, newAppt]);
    return newAppt;
  }

  // Invoices
  static getInvoices() { return this.get<any>(STORAGE_KEYS.INVOICES); }
  static getInvoicesByClient(clientId: string) {
    return this.getInvoices().filter((i: any) => i.clientId === clientId);
  }
  
  // Analytics
  static getAnalytics() {
    const vehicles = this.getVehicles();
    const appts = this.getAppointments();
    const invoices = this.getInvoices();
    const users = this.getUsers();

    const vehiclesByStatus = Object.entries(
      vehicles.reduce((acc: any, v: any) => {
        acc[v.status] = (acc[v.status] || 0) + 1;
        return acc;
      }, {})
    ).map(([status, count]) => ({ status, _count: count }));

    const appointmentsByStatus = Object.entries(
      appts.reduce((acc: any, a: any) => {
        acc[a.status] = (acc[a.status] || 0) + 1;
        return acc;
      }, {})
    ).map(([status, count]) => ({ status, _count: count }));

    const invoiceRevenue = Object.entries(
      invoices.reduce((acc: any, i: any) => {
        if (!acc[i.status]) acc[i.status] = { total: 0, count: 0 };
        acc[i.status].total += i.total;
        acc[i.status].count += 1;
        return acc;
      }, {})
    ).map(([status, data]: [string, any]) => ({ status, _sum: { total: data.total }, _count: data.count }));

    const serviceTypeCounts = Object.entries(
      appts.reduce((acc: any, a: any) => {
        acc[a.serviceType] = (acc[a.serviceType] || 0) + 1;
        return acc;
      }, {})
    ).map(([serviceType, count]) => ({ serviceType, _count: count }))
     .sort((a, b) => b._count - a._count)
     .slice(0, 8);

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentGrowth = users.filter((u: any) => 
      u.role === "CLIENT" && new Date(u.createdAt || Date.now()).getTime() >= thirtyDaysAgo.getTime()
    ).length;

    return {
      vehiclesByStatus,
      appointmentsByStatus,
      invoiceRevenue,
      serviceTypeCounts,
      recentGrowth,
      totalRevenue: invoiceRevenue.find(i => i.status === "PAID")?._sum?.total || 0,
      totalAppointments: appts.length
    };
  }

  // Dashboard Stats
  static getAdminStats() {
    const users = this.getUsers().filter((u: any) => u.role === "CLIENT");
    const vehicles = this.getVehicles();
    const appts = this.getAppointments();
    const invoices = this.getInvoices();
    
    return {
      totalCustomers: users.length,
      totalVehicles: vehicles.length,
      totalAppointments: appts.length,
      pendingCount: appts.filter((a: any) => a.status === "PENDING").length,
      activeCount: appts.filter((a: any) => ["CONFIRMED", "IN_PROGRESS"].includes(a.status)).length,
      totalRevenue: invoices.filter((i: any) => i.status === "PAID").reduce((sum: number, i: any) => sum + i.total, 0),
      recentAppointments: [...appts].sort((a: any, b: any) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()).slice(0, 6),
      recentInvoices: [...invoices].sort((a: any, b: any) => new Date(b.issueDate || b.createdAt).getTime() - new Date(a.issueDate || a.createdAt).getTime()).slice(0, 5),
    };
  }
}
