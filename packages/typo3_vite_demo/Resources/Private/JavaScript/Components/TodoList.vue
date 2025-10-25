<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue';

// i18n translations
const translations = {
  en: {
    cardTitle: 'My To-Do List',
    placeholder: 'What needs to be done?',
    add: 'Add',
    all: 'All',
    active: 'Active',
    done: 'Done',
    delete: 'Delete',
    clearCompleted: 'Clear Completed',
    task: 'task',
    tasks: 'tasks',
    remaining: 'remaining',
    emptyAll: 'No todos yet! Add one above.',
    emptyActive: 'All done! Great job!',
    emptyCompleted: 'No completed tasks yet.',
    addedTask: 'Added task',
    markedCompleted: 'Marked as completed',
    markedActive: 'Marked as active',
    deletedTask: 'Deleted task',
    cleared: 'Cleared',
    maxReached: 'Cannot add more tasks. Maximum of {max} items reached.',
    totalTasks: 'total tasks',
    activeTasks: 'active',
    completedTasks: 'completed',
    showAll: 'Show all tasks',
    showActive: 'Show active tasks only',
    showCompleted: 'Show completed tasks only',
    markAs: 'Mark {text} as {state}',
    max: 'max'
  },
  de: {
    cardTitle: 'Meine Aufgabenliste',
    placeholder: 'Was muss erledigt werden?',
    add: 'Hinzufügen',
    all: 'Alle',
    active: 'Aktiv',
    done: 'Erledigt',
    delete: 'Löschen',
    clearCompleted: 'Erledigte löschen',
    task: 'Aufgabe',
    tasks: 'Aufgaben',
    remaining: 'verbleibend',
    emptyAll: 'Noch keine Aufgaben! Füge eine oben hinzu.',
    emptyActive: 'Alles erledigt! Großartig!',
    emptyCompleted: 'Noch keine erledigten Aufgaben.',
    addedTask: 'Aufgabe hinzugefügt',
    markedCompleted: 'Als erledigt markiert',
    markedActive: 'Als aktiv markiert',
    deletedTask: 'Aufgabe gelöscht',
    cleared: 'Gelöscht',
    maxReached: 'Kann keine weiteren Aufgaben hinzufügen. Maximum von {max} Einträgen erreicht.',
    totalTasks: 'Aufgaben insgesamt',
    activeTasks: 'aktiv',
    completedTasks: 'erledigt',
    showAll: 'Alle Aufgaben anzeigen',
    showActive: 'Nur aktive Aufgaben anzeigen',
    showCompleted: 'Nur erledigte Aufgaben anzeigen',
    markAs: '{text} als {state} markieren',
    max: 'max'
  }
};

// Detect language from HTML lang attribute
const getLanguage = () => {
  const htmlLang = document.documentElement.lang || 'en';
  const lang = htmlLang.split('-')[0].toLowerCase();
  return translations[lang] ? lang : 'en';
};

const currentLang = ref(getLanguage());
const t = computed(() => translations[currentLang.value]);

// Configuration from TYPO3 backend with defaults
const config = ref({
  showDelete: true,
  showFilter: true,
  showClear: true,
  maxItems: 50,
  cardTitle: '',
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

// Calculate next ID based on existing todos
let nextId = 1;

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
  let loadedTodos = loadTodos();
  
  // Reassign all IDs sequentially to prevent any duplicate ID issues
  const fixedTodos = loadedTodos.map((todo, index) => ({
    ...todo,
    id: index + 1
  }));
  
  todos.value = fixedTodos;
  
  // Save the fixed todos to sessionStorage
  if (fixedTodos.length > 0) {
    sessionStorage.setItem('todos', JSON.stringify(fixedTodos));
  }
  
  // Set nextId to count + 1
  nextId = fixedTodos.length + 1;
});

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
      announcement.value = t.value.maxReached.replace('{max}', config.value.maxItems);
      return;
    }

    todos.value.push({
      id: nextId++,
      text,
      completed: false
    });
    announcement.value = `${t.value.addedTask}: ${text}`;
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
      ? `${t.value.markedCompleted}: "${todo.text}"`
      : `${t.value.markedActive}: "${todo.text}"`;
  }
}

function deleteTodo(id) {
  const todo = todos.value.find(t => t.id === id);
  if (todo) {
    announcement.value = `${t.value.deletedTask}: ${todo.text}`;
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
  const taskWord = count === 1 ? t.value.task : t.value.tasks;
  announcement.value = `${t.value.cleared} ${count} ${taskWord}`;

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
      <h2 id="todo-title" class="card-title text-center mb-0 h4">{{ config.cardTitle || t.cardTitle }}</h2>
    </div>
    <div class="card-body p-4">

      <!-- Add new todo -->
      <form @submit.prevent="addTodo" class="mb-4" aria-label="Add new todo">
        <label for="new-todo-input" class="visually-hidden">{{ t.placeholder }}</label>
        <div class="input-group input-group-lg">
          <input
            id="new-todo-input"
            ref="inputRef"
            v-model="newTodo"
            type="text"
            class="form-control"
            :placeholder="t.placeholder"
            aria-describedby="todo-help"
          />
          <button
            type="submit"
            class="btn btn-success h-100"
            style="min-width: 100px;"
            :disabled="!newTodo.trim()"
            :aria-label="newTodo.trim() ? t.add : t.placeholder"
          >
            {{ t.add }}
          </button>
        </div>
        <small id="todo-help" class="visually-hidden">{{ t.placeholder }}</small>
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
            :aria-label="t.showAll"
          >
          <label class="btn btn-outline-secondary me-2" for="filter-all">
            {{ t.all }} <span class="badge bg-secondary badge-circle" :aria-label="`${todos.length} ${t.totalTasks}`">{{ todos.length }}</span>
          </label>

          <input
            type="radio"
            class="btn-check"
            name="filter"
            id="filter-active"
            autocomplete="off"
            :checked="filter === 'active'"
            @change="filter = 'active'"
            :aria-label="t.showActive"
          >
          <label class="btn btn-outline-secondary me-2" for="filter-active">
            {{ t.active }} <span class="badge badge-warning badge-circle" :aria-label="`${activeTodosCount} ${t.activeTasks}`">{{ activeTodosCount }}</span>
          </label>

          <input
            type="radio"
            class="btn-check"
            name="filter"
            id="filter-completed"
            autocomplete="off"
            :checked="filter === 'completed'"
            @change="filter = 'completed'"
            :aria-label="t.showCompleted"
          >
          <label class="btn btn-outline-secondary" for="filter-completed">
            {{ t.done }} <span class="badge badge-success badge-circle" :aria-label="`${todos.length - activeTodosCount} ${t.completedTasks}`">{{ todos.length - activeTodosCount }}</span>
          </label>
        </div>
      </div>

      <!-- Todo list -->
      <div v-if="filteredTodos.length === 0" class="text-center text-muted py-5" role="status" aria-live="polite">
        <p class="fs-5">{{ filter === 'all' ? t.emptyAll : filter === 'active' ? t.emptyActive : t.emptyCompleted }}</p>
      </div>

      <ul v-else class="list-group list-group-flush" role="list" aria-label="Todo items">
        <li
          v-for="todo in filteredTodos"
          :key="todo.id"
          class="list-group-item d-flex align-items-center gap-3 py-3 border-start-0 border-end-0"
          :class="{ 'todo-completed': todo.completed }"
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
              :aria-label="t.markAs.replace('{text}', todo.text).replace('{state}', todo.completed ? t.active : t.done)"
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
            class="btn btn-sm btn-outline-primary opacity-75 hover-opacity-100"
            style="min-width: 70px; white-space: nowrap;"
            :aria-label="`${t.delete} ${todo.text}`"
            :title="`${t.delete} ${todo.text}`"
          >
            {{ t.delete }}
          </button>
        </li>
      </ul>

      <!-- Footer with stats -->
      <div v-if="todos.length > 0" class="d-flex justify-content-between align-items-center pt-4 mt-3 border-top" role="status" aria-live="polite" aria-atomic="true">
        <span class="text-muted" aria-label="Task summary">
          <strong>{{ activeTodosCount }}</strong> {{ activeTodosCount === 1 ? t.task : t.tasks }} {{ t.remaining }}
          <span v-if="config.maxItems" class="ms-2">({{ t.max }}: {{ config.maxItems }})</span>
        </span>
        <button
          v-if="config.showClear && hasCompletedTodos"
          @click="clearCompleted"
          class="btn btn-sm btn-primary"
          style="min-width: 140px; white-space: nowrap;"
          :aria-label="`${t.clearCompleted} (${todos.length - activeTodosCount})`"
        >
          {{ t.clearCompleted }}
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Use Bootstrap CSS variables for theme-aware styling */

/* Card background - adapts to theme */
.card {
  background-color: var(--bs-body-bg);
  color: var(--bs-body-color);
  border-color: var(--bs-border-color);
}

.card-body {
  background-color: var(--bs-body-bg);
}

.form-check-input:checked {
  background-color: var(--bs-success);
  border-color: var(--bs-success);
}

.hover-opacity-100:hover {
  opacity: 1 !important;
}

.btn-check:checked + .btn-outline-secondary {
  background-color: var(--bs-secondary);
  color: var(--bs-white);
}

.input-group-lg .form-control {
  border-right: 0;
}

.list-group-item {
  transition: background-color 0.2s ease;
  background-color: var(--bs-body-bg);
  border-color: var(--bs-border-color);
  color: var(--bs-body-color);
}

/* Theme-aware hover states */
.list-group-item:hover {
  background-color: var(--bs-secondary-bg);
}

/* Completed todo styling - adapts to light/dark mode */
.list-group-item.todo-completed {
  background-color: var(--bs-tertiary-bg);
}

.list-group-item.todo-completed:hover {
  background-color: var(--bs-secondary-bg);
}

/* Dark mode specific styling */
[data-bs-theme="dark"] .card {
  background-color: var(--bs-dark);
  border-color: var(--bs-border-color);
}

[data-bs-theme="dark"] .card-body {
  background-color: var(--bs-dark);
}

[data-bs-theme="dark"] .list-group-item {
  background-color: var(--bs-dark);
  border-color: var(--bs-border-color);
}

[data-bs-theme="dark"] .list-group-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

[data-bs-theme="dark"] .list-group-item.todo-completed {
  background-color: rgba(255, 255, 255, 0.05);
}

[data-bs-theme="dark"] .list-group-item.todo-completed:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Light mode specific styling */
[data-bs-theme="light"] .card {
  background-color: var(--bs-white);
  border-color: var(--bs-border-color);
}

[data-bs-theme="light"] .card-body {
  background-color: var(--bs-white);
}

[data-bs-theme="light"] .list-group-item {
  background-color: var(--bs-white);
  border-color: var(--bs-border-color);
}

[data-bs-theme="light"] .list-group-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

[data-bs-theme="light"] .list-group-item.todo-completed {
  background-color: rgba(0, 0, 0, 0.03);
}

[data-bs-theme="light"] .list-group-item.todo-completed:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

/* Badge styling for both light and dark modes */
.badge-warning {
  background-color: #ffc107;
  color: #000;
}

.badge-success {
  background-color: #198754;
  color: #fff;
}

/* Circular badge styling */
.badge-circle {
  border-radius: 50%;
  width: 2em;
  height: 2em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1;
  margin-left: 0.5rem;
}

/* Dark mode badge styling */
[data-bs-theme="dark"] .badge-warning {
  background-color: #ffca2c;
  color: #000;
}

[data-bs-theme="dark"] .badge-success {
  background-color: #198754;
  color: #fff;
}

/* Dark mode button styling - better contrast */
[data-bs-theme="dark"] .btn-outline-secondary {
  border-color: rgba(108, 117, 125, 0.5);
  color: rgba(255, 255, 255, 0.75);
}

[data-bs-theme="dark"] .btn-outline-secondary:hover {
  background-color: rgba(108, 117, 125, 0.2);
  border-color: rgba(108, 117, 125, 0.7);
  color: rgba(255, 255, 255, 0.9);
}

[data-bs-theme="dark"] .btn-check:checked + .btn-outline-secondary {
  background-color: #6c757d;
  border-color: #6c757d;
  color: #fff;
}
</style>
