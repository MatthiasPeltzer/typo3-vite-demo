/**
 * Bootstrap 5 initialization
 * Import Bootstrap JavaScript only
 * (CSS is imported via SCSS with custom variables in main.scss)
 */

// Import Bootstrap JavaScript (includes Popper.js)
import * as bootstrap from 'bootstrap';

// Make Bootstrap available globally (optional)
window.bootstrap = bootstrap;

/**
 * Initialize all alerts on the page
 */
export function initAlert() {
  const alertList = document.querySelectorAll('.alert');
  const alerts = [...alertList].map(alertEl => new bootstrap.Alert(alertEl));
  return alerts;
}

/**
 * Initialize all buttons on the page
 */
export function initButton() {
  const buttonList = document.querySelectorAll('[data-bs-toggle="button"]');
  const buttons = [...buttonList].map(buttonEl => new bootstrap.Button(buttonEl));
  return buttons;
}

/**
 * Initialize all carousels on the page
 */
export function initCarousel() {
  const carouselList = document.querySelectorAll('.carousel');
  const carousels = [...carouselList].map(carouselEl => new bootstrap.Carousel(carouselEl));
  return carousels;
}

/**
 * Initialize all collapse elements on the page
 */
export function initCollapse() {
  const collapseList = document.querySelectorAll('.collapse');
  const collapses = [...collapseList].map(collapseEl => new bootstrap.Collapse(collapseEl, {
    toggle: false
  }));
  return collapses;
}

/**
 * Initialize all dropdowns on the page
 */
export function initDropdown() {
  const dropdownList = document.querySelectorAll('[data-bs-toggle="dropdown"]');
  const dropdowns = [...dropdownList].map(dropdownEl => new bootstrap.Dropdown(dropdownEl));
  return dropdowns;
}

/**
 * Initialize all modals on the page
 */
export function initModal() {
  const modalList = document.querySelectorAll('.modal');
  const modals = [...modalList].map(modalEl => new bootstrap.Modal(modalEl));
  return modals;
}

/**
 * Initialize all offcanvas elements on the page
 */
export function initOffcanvas() {
  const offcanvasList = document.querySelectorAll('.offcanvas');
  const offcanvases = [...offcanvasList].map(offcanvasEl => new bootstrap.Offcanvas(offcanvasEl, {
    backdrop: true
  }));
  return offcanvases;
}

/**
 * Initialize all popovers on the page
 */
export function initPopover() {
  const popoverList = document.querySelectorAll('[data-bs-toggle="popover"]');
  const popovers = [...popoverList].map(popoverEl => new bootstrap.Popover(popoverEl));
  return popovers;
}

/**
 * Initialize all scrollspy elements on the page
 */
export function initScrollSpy() {
  const scrollSpyList = document.querySelectorAll('[data-bs-spy="scroll"]');
  const scrollSpies = [...scrollSpyList].map(scrollSpyEl => new bootstrap.ScrollSpy(scrollSpyEl));
  return scrollSpies;
}

/**
 * Initialize all tabs on the page
 */
export function initTab() {
  const tabList = document.querySelectorAll('[data-bs-toggle="tab"], [data-bs-toggle="pill"]');
  const tabs = [...tabList].map(tabEl => new bootstrap.Tab(tabEl));
  return tabs;
}

/**
 * Initialize all toasts on the page
 */
export function initToast() {
  const toastList = document.querySelectorAll('.toast');
  const toasts = [...toastList].map(toastEl => new bootstrap.Toast(toastEl));
  return toasts;
}

/**
 * Initialize all tooltips on the page
 */
export function initTooltip() {
  const tooltipList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  const tooltips = [...tooltipList].map(tooltipEl => new bootstrap.Tooltip(tooltipEl));
  return tooltips;
}

export default bootstrap;

