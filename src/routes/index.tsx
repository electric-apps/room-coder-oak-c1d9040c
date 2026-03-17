import {
	Box,
	Button,
	Checkbox,
	Container,
	Flex,
	Heading,
	IconButton,
	Text,
	TextField,
} from "@radix-ui/themes";
import { useLiveQuery } from "@tanstack/react-db";
import { createFileRoute } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { todosCollection } from "@/db/collections/todos";

export const Route = createFileRoute("/")({
	ssr: false,
	loader: () => todosCollection.preload(),
	component: TodoPage,
});

function TodoPage() {
	const [input, setInput] = useState("");

	const { data: todos } = useLiveQuery((q) =>
		q
			.from({ todo: todosCollection })
			.orderBy(({ todo }) => todo.created_at, "asc"),
	);

	const completedCount = todos.filter((t) => t.completed).length;

	function handleAdd() {
		const title = input.trim();
		if (!title) return;
		todosCollection.insert({
			id: crypto.randomUUID(),
			title,
			completed: false,
			created_at: new Date(),
			updated_at: new Date(),
		});
		setInput("");
	}

	function handleToggle(id: string, completed: boolean) {
		todosCollection.update(id, (draft) => {
			draft.completed = !completed;
			draft.updated_at = new Date();
		});
	}

	function handleDelete(id: string) {
		todosCollection.delete(id);
	}

	function handleClearCompleted() {
		for (const todo of todos.filter((t) => t.completed)) {
			todosCollection.delete(todo.id);
		}
	}

	return (
		<Container size="2" py="8">
			<Flex direction="column" gap="6">
				<Heading size="7" align="center">
					My Todos
				</Heading>

				{/* Add todo */}
				<Flex gap="2">
					<Box flexGrow="1">
						<TextField.Root
							placeholder="What needs to be done?"
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && handleAdd()}
							size="3"
						/>
					</Box>
					<Button size="3" onClick={handleAdd} disabled={!input.trim()}>
						Add
					</Button>
				</Flex>

				{/* Todo list */}
				{todos.length === 0 ? (
					<Flex direction="column" align="center" gap="2" py="8">
						<Text size="4" color="gray">
							No todos yet
						</Text>
						<Text size="2" color="gray">
							Add one above to get started
						</Text>
					</Flex>
				) : (
					<Flex direction="column" gap="1">
						{todos.map((todo) => (
							<Flex
								key={todo.id}
								align="center"
								gap="3"
								px="3"
								py="3"
								style={{
									borderRadius: "var(--radius-3)",
									background: "var(--gray-2)",
									opacity: todo.completed ? 0.6 : 1,
								}}
							>
								<Checkbox
									size="2"
									checked={todo.completed}
									onCheckedChange={() => handleToggle(todo.id, todo.completed)}
								/>
								<Text
									size="3"
									flexGrow="1"
									style={{
										textDecoration: todo.completed ? "line-through" : "none",
									}}
								>
									{todo.title}
								</Text>
								<IconButton
									size="1"
									variant="ghost"
									color="red"
									onClick={() => handleDelete(todo.id)}
								>
									<Trash2 size={14} />
								</IconButton>
							</Flex>
						))}
					</Flex>
				)}

				{/* Footer */}
				{todos.length > 0 && (
					<Flex justify="between" align="center">
						<Text size="2" color="gray">
							{todos.length - completedCount} remaining
						</Text>
						{completedCount > 0 && (
							<Button
								size="1"
								variant="ghost"
								color="gray"
								onClick={handleClearCompleted}
							>
								Clear completed ({completedCount})
							</Button>
						)}
					</Flex>
				)}
			</Flex>
		</Container>
	);
}
