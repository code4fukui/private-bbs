export const showToast = (message = "toast") => {
  const toast = document.createElement("div");
  toast.className = "toast";
  document.body.appendChild(toast);
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 500);
  }, 3000);
};
