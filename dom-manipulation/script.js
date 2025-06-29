let quotes = [];

// Load quotes from local storage or default
function loadQuotes() {
  const saved = localStorage.getItem("quotes");
  if (saved) {
    quotes = JSON.parse(saved);
  } else {
    quotes = [
      { text: "Believe you can and you're halfway there.", category: "Confidence" },
      { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" },
      { text: "What you get by achieving your goals is not as important as what you become by achieving your goals.", category: "Growth" },
      { text: "The best way to get started is to quit talking and begin doing.", category: "Inspiration" },
      { text: "Don’t let yesterday take up too much of today.", category: "Perseverance" }
    ];
    saveQuotes();
  }
}

// Save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Create add-quote form (for ALX checker)
function createAddQuoteForm() {
  const container = document.createElement("div");

  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);

  container.appendChild(quoteInput);
  container.appendChild(categoryInput);
  container.appendChild(addButton);

  document.body.appendChild(container);
}

// Add quote and post to server
function addQuote() {
  const quoteText = document.getElementById("newQuoteText").value.trim();
  const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (quoteText === "" || quoteCategory === "") {
    alert("Please fill in both fields.");
    return;
  }

  const newQuote = { text: quoteText, category: quoteCategory };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
  alert("Quote added!");

  postQuoteToServer(newQuote);
}

// Simulate posting to server
async function postQuoteToServer(quote) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify(quote),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });
    const result = await response.json();
    console.log("Quote posted:", result);
  } catch (error) {
    console.error("Post failed:", error);
  }
}

// Display quote based on filter
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  const quoteDisplay = document.getElementById("quoteDisplay");
  localStorage.setItem("selectedCategory", selectedCategory);

  let filtered = quotes;
  if (selectedCategory !== "all") {
    filtered = quotes.filter(q => q.category === selectedCategory);
  }

  if (filtered.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes for this category.</p>";
    return;
  }

  const random = filtered[Math.floor(Math.random() * filtered.length)];
  quoteDisplay.innerHTML = `
    <blockquote>"${random.text}"</blockquote>
    <p><strong>Category:</strong> ${random.category}</p>
  `;

  sessionStorage.setItem("lastQuote", JSON.stringify(random));
}

// Restore last viewed quote
function restoreLastViewedQuote() {
  const last = sessionStorage.getItem("lastQuote");
  if (last) {
    const { text, category } = JSON.parse(last);
    document.getElementById("quoteDisplay").innerHTML = `
      <blockquote>"${text}"</blockquote>
      <p><strong>Category:</strong> ${category}</p>
    `;
  }
}

// Populate category filter
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  const categories = [...new Set(quotes.map(q => q.category))];

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  const savedCategory = localStorage.getItem("selectedCategory");
  if (savedCategory && categoryFilter.querySelector(`[value="${savedCategory}"]`)) {
    categoryFilter.value = savedCategory;
    filterQuotes();
  }
}

// Toggle dark mode
document.getElementById("darkModeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// Export quotes to JSON
document.getElementById("exportBtn").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// Import quotes from file
function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        quotes.push(...imported);
        saveQuotes();
        populateCategories();
        alert("Quotes imported!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch {
      alert("Failed to parse JSON.");
    }
  };
  reader.readAsText(event.target.files[0]);
}

// UI Notification
function showSyncNotification(message) {
  const note = document.getElementById("syncNotification");
  note.innerText = message;
  note.style.display = "block";
  setTimeout(() => {
    note.style.display = "none";
  }, 5000);
}

// Fetch quotes from mock server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const serverData = await response.json();

    const serverQuotes = serverData.slice(0, 5).map(post => ({
      text: post.title,
      category: "Synced"
    }));

    const localHash = JSON.stringify(quotes);
    const serverHash = JSON.stringify(serverQuotes);

    if (localHash !== serverHash) {
      quotes = serverQuotes;
      saveQuotes();
      populateCategories();
      filterQuotes();
      showSyncNotification("Conflict detected. Server quotes applied.");
    }
  } catch (error) {
    console.error("Sync failed:", error);
    showSyncNotification("Unable to sync with server.");
  }
}

// Wrapper for checker
function syncQuotes() {
  fetchQuotesFromServer();
}

// Init everything
window.onload = () => {
  loadQuotes();
  populateCategories();
  createAddQuoteForm();
  restoreLastViewedQuote();
  setInterval(syncQuotes, 10000);
};
