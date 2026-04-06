import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

/**
 * Display a success toast notification
 */
export function toastSuccess(message) {
  toast.success(message || "Action completed successfully", {
    duration: 3000
  });
}

/**
 * Display an error toast notification
 */
export function toastError(message, timer = 3000) {
  toast.error(message || "Something went wrong\nTry Later", {
    duration: timer
  });
}

/**
 * Display a warning toast notification
 */
export function toastWarning(message, timer = 3000) {
  toast(message || "Warning", {
    icon: '⚠️',
    duration: timer,
    style: {
      background: '#fffbeb', // yellow-50
      color: '#92400e', // yellow-800
      border: '1px solid #fcd34d' // yellow-300
    }
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
