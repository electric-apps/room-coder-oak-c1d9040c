import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { todos } from "./schema";

export const todoSelectSchema = createSelectSchema(todos, {
	created_at: z.coerce.date(),
	updated_at: z.coerce.date(),
});

export const todoInsertSchema = createInsertSchema(todos, {
	created_at: z.coerce.date().optional(),
	updated_at: z.coerce.date().optional(),
});

export type Todo = typeof todoSelectSchema._type;
export type NewTodo = typeof todoInsertSchema._type;
