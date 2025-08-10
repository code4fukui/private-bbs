let bktoast = null;

export const showToast = (message = "toast", timeout = 3000) => {
  if (bktoast) {
    document.body.removeChild(bktoast);
  }
  const toast = document.createElement("div");
  toast.className = "toast";
  document.body.appendChild(toast);
  toast.textContent = message;
  toast.classList.add("show");
  if (timeout) {
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 500);
    }, timeout);
  }
  bktoast = toast;
};
