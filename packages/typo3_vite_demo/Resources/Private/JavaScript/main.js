import 'vite/modulepreload-polyfill';
import '../Scss/main.scss';
import { createApp } from 'vue'
import TodoList from './Components/TodoList.vue';

// Import Bootstrap
import bootstrap, { initAlert, initButton, initCarousel, initCollapse, initDropdown, initModal, initOffcanvas, initPopover, initScrollSpy, initTab, initToast, initTooltip  } from './bootstrap-init.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Vue components
  const containerElements = document.querySelectorAll('[data-container="vue"]');
  containerElements.forEach(element => {
    const component = element.getAttribute('data-component');
    switch (component) {
      case 'TodoList': {
        createApp(TodoList).mount(element);
        break;
      }
    }
  });

  // Initialize all Bootstrap components
  initAlert();
  initButton();
  initCarousel();
  initCollapse();
  initDropdown();
  initModal();
  initOffcanvas();
  initPopover();
  initScrollSpy();
  initTab();
  initToast();
  initTooltip();
})

console.log('Hello TYPO3 13, hello vue, hello Vite, hello Bootstrap!');
