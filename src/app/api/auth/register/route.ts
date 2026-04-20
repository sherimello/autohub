import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email } = registerSchema.parse(body);

    // Mock successful registration
    const user = {
      id: `u-${Date.now()}`,
      name,
      email,
      role: "CLIENT",
    };

    return NextResponse.json({ 
      user, 
      message: "Registration successful (Mock Mode). You can now login." 
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
