import { describe, expect, it } from "vitest"
import { todoInsertSchema, todoSelectSchema } from "@/db/zod-schemas"
import { todos } from "@/db/schema"
import { generateValidRow, generateRowWithout } from "./helpers/schema-test-utils"

describe("todoSelectSchema", () => {
  it("validates a complete row", () => {
    const row = generateValidRow(todoSelectSchema)
    const result = todoSelectSchema.safeParse(row)
    expect(result.success).toBe(true)
  })

  it("rejects a row missing title", () => {
    const row = generateRowWithout(todoSelectSchema, "title")
    const result = todoSelectSchema.safeParse(row)
    expect(result.success).toBe(false)
  })

  it("rejects a row missing completed", () => {
    const row = generateRowWithout(todoSelectSchema, "completed")
    const result = todoSelectSchema.safeParse(row)
    expect(result.success).toBe(false)
  })

  it("coerces date strings for created_at", () => {
    const row = generateValidRow(todoSelectSchema)
    const rowWithStringDate = { ...row, created_at: new Date().toISOString() }
    const result = todoSelectSchema.safeParse(rowWithStringDate)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.created_at).toBeInstanceOf(Date)
    }
  })

  it("coerces date strings for updated_at", () => {
    const row = generateValidRow(todoSelectSchema)
    const rowWithStringDate = { ...row, updated_at: new Date().toISOString() }
    const result = todoSelectSchema.safeParse(rowWithStringDate)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.updated_at).toBeInstanceOf(Date)
    }
  })
})

describe("todoInsertSchema", () => {
  it("validates a minimal insert row (id optional)", () => {
    const row = { title: "Buy groceries", completed: false }
    const result = todoInsertSchema.safeParse(row)
    expect(result.success).toBe(true)
  })

  it("rejects a row missing title", () => {
    const row = { completed: false }
    const result = todoInsertSchema.safeParse(row)
    expect(result.success).toBe(false)
  })
})

describe("todos table schema shape", () => {
  it("has expected columns", () => {
    const columns = Object.keys(todos)
    expect(columns).toContain("id")
    expect(columns).toContain("title")
    expect(columns).toContain("completed")
    expect(columns).toContain("created_at")
    expect(columns).toContain("updated_at")
  })
})
