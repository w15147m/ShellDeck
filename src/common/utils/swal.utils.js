import Swal from 'sweetalert2';

const toast = Swal.mixin({
  toast: true,
  position: 'top',
  showConfirmButton: false,
  timerProgressBar: false,
  width: 'auto',
  customClass: {
    popup: 'dark:bg-gray-900 border dark:border-gray-800 shadow-md rounded-full flex flex-row items-center !py-1.5 !px-5 mt-2 !w-auto !max-w-fit',
    title: 'dark:text-white !text-[13px] !font-medium !m-0 !pl-1',
    icon: '!scale-[0.45] !m-0 !mt-[-25px] !mb-[-25px] !ml-[-15px]',
  },
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
    timer: 2000,
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
      popup: 'dark:bg-gray-900 dark:border-gray-800 border rounded-2xl !p-6 !pb-5 !w-64',
      title: 'dark:text-white !text-base !font-bold !p-0 !m-0',
      htmlContainer: 'dark:text-gray-400 !text-xs !m-0 !mt-2',
      icon: '!scale-50 !mx-auto !m-0 !mt-[-15px] !mb-[-5px]',
      actions: '!m-0 !mt-4',
      confirmButton: '!py-1.5 !px-4 !text-xs !rounded-xl !m-1',
      cancelButton: '!py-1.5 !px-4 !text-xs !rounded-xl !m-1'
    }
  });
}
