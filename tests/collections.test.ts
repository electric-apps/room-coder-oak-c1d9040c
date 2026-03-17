import { describe, expect, it } from "vitest"
import { todoInsertSchema, todoSelectSchema } from "@/db/zod-schemas"
import { generateValidRow, parseDates } from "./helpers/schema-test-utils"

describe("todo collection insert validation", () => {
	it("validates a todo row with all fields", () => {
		const row = generateValidRow(todoSelectSchema)
		const result = todoSelectSchema.safeParse(row)
		expect(result.success).toBe(true)
	})

	it("validates minimal insert (title + completed)", () => {
		const row = { title: "Write tests", completed: false }
		const result = todoInsertSchema.safeParse(row)
		expect(result.success).toBe(true)
	})

	it("rejects insert missing title", () => {
		const result = todoInsertSchema.safeParse({ completed: false })
		expect(result.success).toBe(false)
	})

	it("JSON round-trip: parseDates restores Date objects", () => {
		const row = generateValidRow(todoSelectSchema)
		const serialized = JSON.parse(JSON.stringify(row))
		const restored = parseDates(serialized)
		const result = todoSelectSchema.safeParse(restored)
		expect(result.success).toBe(true)
		if (result.success) {
			expect(result.data.created_at).toBeInstanceOf(Date)
			expect(result.data.updated_at).toBeInstanceOf(Date)
		}
	})
})
