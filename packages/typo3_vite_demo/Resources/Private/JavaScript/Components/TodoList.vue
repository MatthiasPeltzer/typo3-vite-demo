<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue';

// Configuration from TYPO3 backend with defaults
const config = ref({
  showDelete: true,
  showFilter: true,
  showClear: true,
  maxItems: 50,
  cardTitle: 'My To-Do List',
  colorScheme: 'primary',
  predefinedItems: ''
});

// Initialize todos (will be loaded after config is read)
const todos = ref([]);

// Load todos from sessionStorage or use predefined/default items
const loadTodos = () => {
  const saved = sessionStorage.getItem('todos');
  if (saved) {
    return JSON.parse(saved);
  }
  
  // Use predefined items from backend if available
  if (config.value.predefinedItems) {
    const items = config.value.predefinedItems
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map((text, index) => ({
        id: index + 1,
        text,
        completed: false
      }));
    if (items.length > 0) return items;
  }
  
  // Default items
  return [
    { id: 1, text: 'Learn Vue 3', completed: false },
    { id: 2, text: 'Build something awesome', completed: false },
    { id: 3, text: 'Integrate with TYPO3', completed: true }
  ];
};

// Load configuration from data attributes
onMounted(() => {
  const container = document.querySelector('[data-component="TodoList"]');
  if (container) {
    // Read individual data attributes
    if (container.dataset.showDelete !== undefined && container.dataset.showDelete !== '') {
      config.value.showDelete = container.dataset.showDelete === '1';
    }
    if (container.dataset.showFilter !== undefined && container.dataset.showFilter !== '') {
      config.value.showFilter = container.dataset.showFilter === '1';
    }
    if (container.dataset.showClear !== undefined && container.dataset.showClear !== '') {
      config.value.showClear = container.dataset.showClear === '1';
    }
    if (container.dataset.maxItems) {
      config.value.maxItems = parseInt(container.dataset.maxItems) || 50;
    }
    if (container.dataset.cardTitle) {
      config.value.cardTitle = container.dataset.cardTitle;
    }
    if (container.dataset.colorScheme) {
      config.value.colorScheme = container.dataset.colorScheme;
    }
    if (container.dataset.predefinedItems) {
      config.value.predefinedItems = container.dataset.predefinedItems;
    }
  }
  
  // Load todos after config is loaded
  todos.value = loadTodos();
});

// Calculate next ID based on existing todos
let nextId = todos.value.length > 0
  ? Math.max(...todos.value.map(t => t.id)) + 1
  : 1;

const newTodo = ref('');
const filter = ref('all'); // 'all', 'active', 'completed'
const inputRef = ref(null);
const announcement = ref(''); // For screen reader announcements

// Watch todos and save to sessionStorage whenever they change
watch(todos, (newTodos) => {
  sessionStorage.setItem('todos', JSON.stringify(newTodos));
}, { deep: true });

const filteredTodos = computed(() => {
  switch (filter.value) {
    case 'active':
      return todos.value.filter(todo => !todo.completed);
    case 'completed':
      return todos.value.filter(todo => todo.completed);
    default:
      return todos.value;
  }
});

const activeTodosCount = computed(() => {
  return todos.value.filter(todo => !todo.completed).length;
});

const hasCompletedTodos = computed(() => {
  return todos.value.some(todo => todo.completed);
});

function addTodo() {
  const text = newTodo.value.trim();
  if (text) {
    // Check max items limit
    if (config.value.maxItems && todos.value.length >= config.value.maxItems) {
      announcement.value = `Cannot add more tasks. Maximum of ${config.value.maxItems} items reached.`;
      return;
    }
    
    todos.value.push({
      id: nextId++,
      text,
      completed: false
    });
    announcement.value = `Added task: ${text}`;
    newTodo.value = '';

    // Return focus to input after adding
    nextTick(() => {
      inputRef.value?.focus();
    });
  }
}

function toggleTodo(id) {
  const todo = todos.value.find(t => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    announcement.value = todo.completed
      ? `Marked "${todo.text}" as completed`
      : `Marked "${todo.text}" as active`;
  }
}

function deleteTodo(id) {
  const todo = todos.value.find(t => t.id === id);
  if (todo) {
    announcement.value = `Deleted task: ${todo.text}`;
    todos.value = todos.value.filter(t => t.id !== id);

    // Return focus to input after deleting
    nextTick(() => {
      inputRef.value?.focus();
    });
  }
}

function clearCompleted() {
  const count = todos.value.filter(t => t.completed).length;
  todos.value = todos.value.filter(todo => !todo.completed);
  announcement.value = `Cleared ${count} completed ${count === 1 ? 'task' : 'tasks'}`;

  // Return focus to input after clearing
  nextTick(() => {
    inputRef.value?.focus();
  });
}
</script>

<template>
  <section class="card shadow my-4" style="max-width: 650px;" aria-labelledby="todo-title">
    <!-- Screen reader announcements -->
    <div role="status" aria-live="polite" aria-atomic="true" class="visually-hidden">
      {{ announcement }}
    </div>

    <div :class="`card-header bg-${config.colorScheme} text-white py-3`">
      <h2 id="todo-title" class="card-title text-center mb-0 h4">{{ config.cardTitle }}</h2>
    </div>
    <div class="card-body p-4">

      <!-- Add new todo -->
      <form @submit.prevent="addTodo" class="mb-4" aria-label="Add new todo">
        <label for="new-todo-input" class="visually-hidden">New task description</label>
        <div class="input-group input-group-lg">
          <input
            id="new-todo-input"
            ref="inputRef"
            v-model="newTodo"
            type="text"
            class="form-control"
            placeholder="What needs to be done?"
            aria-describedby="todo-help"
          />
          <button
            type="submit"
            class="btn btn-success h-100"
            style="min-width: 100px;"
            :disabled="!newTodo.trim()"
            :aria-label="newTodo.trim() ? 'Add new task' : 'Enter a task to add'"
          >
            Add
          </button>
        </div>
        <small id="todo-help" class="visually-hidden">Type a task and press Add or Enter to create a new todo item</small>
      </form>

      <!-- Filter buttons -->
      <div v-if="config.showFilter" class="d-flex justify-content-center mb-4">
        <div class="btn-group shadow-sm" role="group" aria-label="Filter todo list">
          <input
            type="radio"
            class="btn-check"
            name="filter"
            id="filter-all"
            autocomplete="off"
            :checked="filter === 'all'"
            @change="filter = 'all'"
            aria-label="Show all tasks"
          >
          <label class="btn btn-outline-secondary" for="filter-all">
            All <span class="badge bg-secondary rounded-pill" aria-label=", {{ todos.length }} total">{{ todos.length }}</span>
          </label>

          <input
            type="radio"
            class="btn-check"
            name="filter"
            id="filter-active"
            autocomplete="off"
            :checked="filter === 'active'"
            @change="filter = 'active'"
            aria-label="Show active tasks only"
          >
          <label class="btn btn-outline-secondary" for="filter-active">
            Active <span class="badge bg-warning text-dark rounded-pill" aria-label=", {{ activeTodosCount }} active">{{ activeTodosCount }}</span>
          </label>

          <input
            type="radio"
            class="btn-check"
            name="filter"
            id="filter-completed"
            autocomplete="off"
            :checked="filter === 'completed'"
            @change="filter = 'completed'"
            aria-label="Show completed tasks only"
          >
          <label class="btn btn-outline-secondary" for="filter-completed">
            Done <span class="badge bg-success rounded-pill" aria-label=", {{ todos.length - activeTodosCount }} done">{{ todos.length - activeTodosCount }}</span>
          </label>
        </div>
      </div>

      <!-- Todo list -->
      <div v-if="filteredTodos.length === 0" class="text-center text-muted py-5" role="status" aria-live="polite">
        <p class="fs-5">{{ filter === 'all' ? 'No todos yet! Add one above.' : filter === 'active' ? 'All done! Great job!' : 'No completed tasks yet.' }}</p>
      </div>

      <ul v-else class="list-group list-group-flush" role="list" aria-label="Todo items">
        <li
          v-for="todo in filteredTodos"
          :key="todo.id"
          class="list-group-item d-flex align-items-center gap-3 py-3 border-start-0 border-end-0"
          :class="{ 'bg-light': todo.completed }"
          role="listitem"
        >
          <div class="form-check form-switch">
            <input
              type="checkbox"
              :id="`todo-${todo.id}`"
              :checked="todo.completed"
              @change="toggleTodo(todo.id)"
              class="form-check-input"
              role="switch"
              :aria-label="`Mark ${todo.text} as ${todo.completed ? 'active' : 'completed'}`"
              :aria-checked="todo.completed"
              style="cursor: pointer; width: 3em; height: 1.5em;"
            />
          </div>
          <label
            :for="`todo-${todo.id}`"
            class="flex-grow-1 mb-0 user-select-none"
            style="cursor: pointer;"
            :class="{ 'text-decoration-line-through text-muted': todo.completed, 'fw-semibold': !todo.completed }"
          >
            {{ todo.text }}
          </label>
          <button
            v-if="config.showDelete"
            @click="deleteTodo(todo.id)"
            class="btn btn-sm btn-outline-danger opacity-75 hover-opacity-100"
            style="min-width: 70px; white-space: nowrap;"
            :aria-label="`Delete ${todo.text}`"
            :title="`Delete ${todo.text}`"
          >
            Delete
          </button>
        </li>
      </ul>

      <!-- Footer with stats -->
      <div v-if="todos.length > 0" class="d-flex justify-content-between align-items-center pt-4 mt-3 border-top" role="status" aria-live="polite" aria-atomic="true">
        <span class="text-muted" aria-label="Task summary">
          <strong>{{ activeTodosCount }}</strong> {{ activeTodosCount === 1 ? 'task' : 'tasks' }} remaining
          <span v-if="config.maxItems" class="ms-2">(max: {{ config.maxItems }})</span>
        </span>
        <button
          v-if="config.showClear && hasCompletedTodos"
          @click="clearCompleted"
          class="btn btn-sm btn-danger"
          style="min-width: 140px; white-space: nowrap;"
          :aria-label="`Clear ${todos.length - activeTodosCount} completed ${todos.length - activeTodosCount === 1 ? 'task' : 'tasks'}`"
        >
          Clear Completed
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.form-check-input:checked {
  background-color: #198754;
  border-color: #198754;
}

.hover-opacity-100:hover {
  opacity: 1 !important;
}

.btn-check:checked + .btn-outline-secondary {
  background-color: #6c757d;
  color: white;
}

.input-group-lg .form-control {
  border-right: 0;
}

.list-group-item {
  transition: background-color 0.2s ease;
}

.list-group-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.list-group-item.bg-light:hover {
  background-color: rgba(0, 0, 0, 0.05) !important;
}
</style>
