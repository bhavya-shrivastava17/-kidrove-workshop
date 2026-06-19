import { Router } from "express";
import { z } from "zod";
import { db, enquiriesTable } from "@workspace/db";
import { desc } from "drizzle-orm";

const router = Router();

const enquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Phone number must be at least 7 characters"),
  message: z.string().optional().nullable(),
});

router.post("/enquiry", async (req, res) => {
  const parseResult = enquirySchema.safeParse(req.body);

  if (!parseResult.success) {
    const firstError = parseResult.error.issues[0];
    return res.status(400).json({ error: firstError?.message ?? "Validation failed" });
  }

  const { name, email, phone, message } = parseResult.data;

  const [inserted] = await db
    .insert(enquiriesTable)
    .values({ name, email, phone, message: message ?? null })
    .returning({ id: enquiriesTable.id });

  req.log.info({ id: inserted?.id }, "Enquiry submitted");

  return res.status(201).json({
    success: true,
    message: "Thank you for your interest! We'll reach out to you shortly.",
    id: inserted?.id ?? 0,
  });
});

router.get("/enquiries", async (req, res) => {
  const rows = await db
    .select()
    .from(enquiriesTable)
    .orderBy(desc(enquiriesTable.createdAt));

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay());

  const todayCount = rows.filter((r) => new Date(r.createdAt) >= startOfToday).length;
  const thisWeekCount = rows.filter((r) => new Date(r.createdAt) >= startOfWeek).length;

  req.log.info({ total: rows.length }, "Enquiries listed");

  return res.status(200).json({
    data: rows,
    total: rows.length,
    todayCount,
    thisWeekCount,
  });
});

export default router;
