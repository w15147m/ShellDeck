import Swal from 'sweetalert2';

// Create a generic toast mixin for notifications
const toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timerProgressBar: true,
  didOpen: (toastEl) => {
    toastEl.addEventListener('mouseenter', Swal.stopTimer);
    toastEl.addEventListener('mouseleave', Swal.resumeTimer);
  }
});

/**
 * Display a success toast notification
 */
export function toastSuccess(message) {
  toast.fire({
    icon: "success",
    timer: 3000,
    title: message || "Action completed successfully",
  });
}

/**
 * Display an error toast notification
 */
export function toastError(message, timer = 3000) {
  toast.fire({
    icon: "error",
    timer: timer,
    title: message || "Something went wrong\nTry Later",
  });
}

/**
 * Display a warning toast notification
 */
export function toastWarning(message, timer = 3000) {
  toast.fire({
    icon: "warning",
    timer: timer,
    title: message || "Warning",
  });
}

/**
 * Display a generic informational popup
 */
export function swalInfo({ title = "", text = "", html = "", icon = "info", confirmText = "OK" }) {
  return Swal.fire({
    title,
    text,
    html,
    icon,
    confirmButtonText: confirmText,
  });
}

/**
 * Enhanced confirmation dialog
 */
export function swalConfirm({
  title = "Are you sure?",
  text = "",
  html = "",
  icon = "warning",
  confirmText = "Yes, proceed!",
  cancelText = "Cancel",
  denyText = "Don't save",
  confirmColor = "#6366f1", // brand-500
  cancelColor = "#ef4444",  // red-500
  denyColor = "#9ca3af",    // gray-400
  showDenyButton = false,
}) {
  return Swal.fire({
    title,
    text,
    html,
    icon,
    showCancelButton: true,
    showDenyButton,
    confirmButtonColor: confirmColor,
    cancelButtonColor: cancelColor,
    denyButtonColor: denyColor,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    denyButtonText: denyText,
    customClass: {
      popup: 'dark:bg-gray-900 dark:border-gray-800 border rounded-2xl',
      title: 'dark:text-white',
      htmlContainer: 'dark:text-gray-400',
    }
  });
}
