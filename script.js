const progress = document.getElementById("readingProgress");
const article = document.getElementById("article");
const readingTime = document.getElementById("readingTime");
const tocLinks = [...document.querySelectorAll(".toc-link")];
const sections = [...document.querySelectorAll("article section[id]")];
const toast = document.getElementById("toast");

function updateReadingProgress() {
  const articleTop = article.offsetTop;
  const articleHeight = article.offsetHeight;
  const scrollTop = window.scrollY;
  const viewport = window.innerHeight;

  const start = articleTop - viewport * 0.2;
  const end = articleTop + articleHeight - viewport;
  const percentage = Math.min(100, Math.max(0, ((scrollTop - start) / (end - start)) * 100));

  progress.style.width = percentage + "%";
}

function calculateReadingTime() {
  const text = article.innerText.trim();
  const words = text.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 220));
  readingTime.textContent = `${minutes} min read`;
}

function updateActiveToc() {
  const marker = window.scrollY + 150;
  let currentId = sections[0]?.id || "";

  sections.forEach(section => {
    if (section.offsetTop <= marker) currentId = section.id;
  });

  tocLinks.forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
  });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 1800);
}

document.querySelectorAll(".share-btn").forEach(button => {
  button.addEventListener("click", async () => {
    const action = button.dataset.share;
    const url = window.location.href;
    const title = document.title;

    if (action === "linkedin") {
      const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
      window.open(shareUrl, "_blank", "noopener,noreferrer,width=760,height=640");
    }

    if (action === "copy") {
      try {
        await navigator.clipboard.writeText(url);
        showToast("Article link copied");
      } catch {
        showToast("Copy failed");
      }
    }
  });
});

window.addEventListener("scroll", () => {
  updateReadingProgress();
  updateActiveToc();
}, { passive: true });

window.addEventListener("resize", updateReadingProgress);

calculateReadingTime();
updateReadingProgress();
updateActiveToc();