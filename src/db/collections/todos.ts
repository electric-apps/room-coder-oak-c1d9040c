import { electricCollectionOptions } from "@tanstack/electric-db-collection";
import { createCollection } from "@tanstack/react-db";
import { todoSelectSchema } from "@/db/zod-schemas";

const baseUrl =
	typeof window !== "undefined"
		? window.location.origin
		: `http://localhost:${process.env.VITE_PORT || 5173}`;

export const todosCollection = createCollection(
	electricCollectionOptions({
		id: "todos",
		schema: todoSelectSchema,
		getKey: (row) => row.id,
		shapeOptions: {
			url: `${baseUrl}/api/todos`,
			parser: {
				timestamptz: (date: string) => new Date(date),
			},
		},
		onInsert: async ({ transaction }) => {
			const { modified: todo } = transaction.mutations[0];
			const response = await fetch("/api/mutations/todos", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(todo),
			});
			if (!response.ok) throw new Error("Failed to create todo");
			const { txid } = await response.json();
			return { txid };
		},
		onUpdate: async ({ transaction }) => {
			const { modified: todo } = transaction.mutations[0];
			const response = await fetch(`/api/mutations/todos`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(todo),
			});
			if (!response.ok) throw new Error("Failed to update todo");
			const { txid } = await response.json();
			return { txid };
		},
		onDelete: async ({ transaction }) => {
			const { original: todo } = transaction.mutations[0];
			const response = await fetch(`/api/mutations/todos`, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id: todo.id }),
			});
			if (!response.ok) throw new Error("Failed to delete todo");
			const { txid } = await response.json();
			return { txid };
		},
	}),
);
