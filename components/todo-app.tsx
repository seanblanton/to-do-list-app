"use client"

import type React from "react"

import { useMemo, useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

type Todo = {
  id: string
  text: string
  completed: boolean
}

type Filter = "all" | "active" | "completed"

export function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [text, setText] = useState("")
  const [filter, setFilter] = useState<Filter>("all")

  function addTodo(e: React.FormEvent) {
    e.preventDefault()
    const value = text.trim()
    if (!value) return
    setTodos((prev) => [
      { id: crypto.randomUUID(), text: value, completed: false },
      ...prev,
    ])
    setText("")
  }

  function toggleTodo(id: string) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    )
  }

  function removeTodo(id: string) {
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }

  function clearCompleted() {
    setTodos((prev) => prev.filter((t) => !t.completed))
  }

  const filtered = useMemo(() => {
    if (filter === "active") return todos.filter((t) => !t.completed)
    if (filter === "completed") return todos.filter((t) => t.completed)
    return todos
  }, [todos, filter])

  const remaining = todos.filter((t) => !t.completed).length

  return (
    <div className="w-full max-w-md">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground text-balance">
          Tasks
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {remaining} {remaining === 1 ? "task" : "tasks"} remaining
        </p>
      </header>

      <form onSubmit={addTodo} className="flex items-center gap-2">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a new task..."
          aria-label="New task"
          className="h-11"
        />
        <Button type="submit" size="icon" className="h-11 w-11 shrink-0" aria-label="Add task">
          <Plus className="h-5 w-5" />
        </Button>
      </form>

      <div className="mt-4 flex items-center gap-1 rounded-lg bg-muted p-1">
        {(["all", "active", "completed"] as Filter[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={cn(
              "flex-1 rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors",
              filter === f
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <ul className="mt-4 flex flex-col gap-2">
        {filtered.length === 0 ? (
          <li className="rounded-lg border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
            {filter === "completed"
              ? "No completed tasks yet."
              : filter === "active"
                ? "No active tasks. Nice work!"
                : "No tasks yet. Add one above."}
          </li>
        ) : (
          filtered.map((todo) => (
            <li
              key={todo.id}
              className="group flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-3"
            >
              <Checkbox
                id={`todo-${todo.id}`}
                checked={todo.completed}
                onCheckedChange={() => toggleTodo(todo.id)}
                aria-label={`Mark "${todo.text}" as ${todo.completed ? "incomplete" : "complete"}`}
              />
              <label
                htmlFor={`todo-${todo.id}`}
                className={cn(
                  "flex-1 cursor-pointer text-sm leading-relaxed text-card-foreground",
                  todo.completed && "text-muted-foreground line-through",
                )}
              >
                {todo.text}
              </label>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeTodo(todo.id)}
                className="h-8 w-8 shrink-0 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                aria-label={`Delete "${todo.text}"`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))
        )}
      </ul>

      {todos.some((t) => t.completed) && (
        <div className="mt-4 flex justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearCompleted}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear completed
          </Button>
        </div>
      )}
    </div>
  )
}
