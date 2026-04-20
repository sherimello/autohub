import { PrismaClient, UserRole, ServiceType, AppointmentStatus, InvoiceStatus, VehicleStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const adminPassword = await bcrypt.hash("admin123", 12);
  const clientPassword = await bcrypt.hash("client123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@autohub.com" },
    update: {},
    create: {
      email: "admin@autohub.com",
      name: "System Admin",
      password: adminPassword,
      role: UserRole.ADMIN,
      phone: "+1-555-0100",
    },
  });

  const client1 = await prisma.user.upsert({
    where: { email: "john@example.com" },
    update: {},
    create: {
      email: "john@example.com",
      name: "John Mitchell",
      password: clientPassword,
      role: UserRole.CLIENT,
      phone: "+1-555-0101",
      address: "123 Main St, New York, NY 10001",
    },
  });

  const client2 = await prisma.user.upsert({
    where: { email: "sarah@example.com" },
    update: {},
    create: {
      email: "sarah@example.com",
      name: "Sarah Williams",
      password: clientPassword,
      role: UserRole.CLIENT,
      phone: "+1-555-0102",
      address: "456 Park Ave, New York, NY 10022",
    },
  });

  await prisma.service.createMany({
    data: [
      { name: "Oil Change", serviceType: ServiceType.OIL_CHANGE, basePrice: 49.99, duration: 30, description: "Full synthetic oil change with filter" },
      { name: "Tire Rotation", serviceType: ServiceType.TIRE_ROTATION, basePrice: 29.99, duration: 45, description: "Complete tire rotation and pressure check" },
      { name: "Brake Service", serviceType: ServiceType.BRAKE_SERVICE, basePrice: 199.99, duration: 120, description: "Brake pad replacement and rotor inspection" },
      { name: "Engine Diagnostic", serviceType: ServiceType.ENGINE_DIAGNOSTIC, basePrice: 89.99, duration: 60, description: "Full engine diagnostic scan" },
      { name: "AC Service", serviceType: ServiceType.AC_SERVICE, basePrice: 149.99, duration: 90, description: "AC recharge and system check" },
      { name: "Full Detailing", serviceType: ServiceType.DETAILING, basePrice: 299.99, duration: 240, description: "Interior and exterior detailing" },
    ],
    skipDuplicates: true,
  });

  const vehicle1 = await prisma.vehicle.create({
    data: {
      ownerId: client1.id,
      make: "BMW",
      model: "M3",
      year: 2022,
      vin: "WBS4Y9C03NCJ12345",
      licensePlate: "NYC-M3-22",
      color: "Alpine White",
      mileage: 18500,
      status: VehicleStatus.ACTIVE,
    },
  });

  const vehicle2 = await prisma.vehicle.create({
    data: {
      ownerId: client1.id,
      make: "Porsche",
      model: "911 GT3",
      year: 2023,
      vin: "WP0AC2A99PS244567",
      licensePlate: "NYC-GT3-23",
      color: "Guards Red",
      mileage: 5200,
      status: VehicleStatus.ACTIVE,
    },
  });

  const vehicle3 = await prisma.vehicle.create({
    data: {
      ownerId: client2.id,
      make: "Mercedes-Benz",
      model: "AMG GT",
      year: 2021,
      vin: "WDDYJ7JA5JA012345",
      licensePlate: "NYC-AMG-21",
      color: "Obsidian Black",
      mileage: 24100,
      status: VehicleStatus.IN_SERVICE,
    },
  });

  const appt1 = await prisma.appointment.create({
    data: {
      clientId: client1.id,
      vehicleId: vehicle1.id,
      serviceType: ServiceType.OIL_CHANGE,
      status: AppointmentStatus.COMPLETED,
      scheduledAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      duration: 30,
      totalAmount: 49.99,
    },
  });

  const appt2 = await prisma.appointment.create({
    data: {
      clientId: client2.id,
      vehicleId: vehicle3.id,
      serviceType: ServiceType.BRAKE_SERVICE,
      status: AppointmentStatus.IN_PROGRESS,
      scheduledAt: new Date(),
      duration: 120,
      totalAmount: 199.99,
    },
  });

  await prisma.appointment.create({
    data: {
      clientId: client1.id,
      vehicleId: vehicle2.id,
      serviceType: ServiceType.ENGINE_DIAGNOSTIC,
      status: AppointmentStatus.CONFIRMED,
      scheduledAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      duration: 60,
    },
  });

  const invoice1 = await prisma.invoice.create({
    data: {
      clientId: client1.id,
      vehicleId: vehicle1.id,
      appointmentId: appt1.id,
      invoiceNumber: "INV-2024-001",
      status: InvoiceStatus.PAID,
      issueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() - 0 * 24 * 60 * 60 * 1000),
      subtotal: 49.99,
      tax: 4.5,
      total: 54.49,
      items: {
        create: [
          { description: "Full Synthetic Oil Change", quantity: 1, unitPrice: 49.99, total: 49.99 },
        ],
      },
    },
  });

  await prisma.invoice.create({
    data: {
      clientId: client2.id,
      vehicleId: vehicle3.id,
      appointmentId: appt2.id,
      invoiceNumber: "INV-2024-002",
      status: InvoiceStatus.SENT,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      subtotal: 199.99,
      tax: 18.0,
      total: 217.99,
      items: {
        create: [
          { description: "Brake Pad Replacement (Front)", quantity: 1, unitPrice: 129.99, total: 129.99 },
          { description: "Rotor Inspection & Resurface", quantity: 1, unitPrice: 70.0, total: 70.0 },
        ],
      },
    },
  });

  console.log("Seed complete!");
  console.log("Admin: admin@autohub.com / admin123");
  console.log("Client: john@example.com / client123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
