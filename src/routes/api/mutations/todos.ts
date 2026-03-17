import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";
import { db } from "@/db";
import { todos } from "@/db/schema";
import { generateTxId, parseDates } from "@/db/utils";
import { todoInsertSchema } from "@/db/zod-schemas";

const patchSchema = todoInsertSchema
	.pick({ id: true, title: true, completed: true })
	.required({ id: true });
const deleteSchema = z.object({ id: z.string().uuid() });

export const Route = createFileRoute("/api/mutations/todos")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				const raw = parseDates(await request.json());
				const parsed = todoInsertSchema.safeParse(raw);
				if (!parsed.success) {
					return Response.json({ error: parsed.error.issues }, { status: 400 });
				}
				const txid = await db.transaction(async (tx) => {
					await tx.insert(todos).values({
						id: parsed.data.id ?? crypto.randomUUID(),
						title: parsed.data.title,
						completed: parsed.data.completed ?? false,
						created_at: parsed.data.created_at,
						updated_at: parsed.data.updated_at,
					});
					return generateTxId(tx);
				});
				return Response.json({ txid });
			},

			PATCH: async ({ request }) => {
				const raw = parseDates(await request.json());
				const parsed = patchSchema.safeParse(raw);
				if (!parsed.success) {
					return Response.json({ error: parsed.error.issues }, { status: 400 });
				}
				const txid = await db.transaction(async (tx) => {
					await tx
						.update(todos)
						.set({
							title: parsed.data.title,
							completed: parsed.data.completed,
							updated_at: new Date(),
						})
						.where(eq(todos.id, parsed.data.id));
					return generateTxId(tx);
				});
				return Response.json({ txid });
			},

			DELETE: async ({ request }) => {
				const raw = await request.json();
				const parsed = deleteSchema.safeParse(raw);
				if (!parsed.success) {
					return Response.json({ error: parsed.error.issues }, { status: 400 });
				}
				const txid = await db.transaction(async (tx) => {
					await tx.delete(todos).where(eq(todos.id, parsed.data.id));
					return generateTxId(tx);
				});
				return Response.json({ txid });
			},
		},
	},
});
