let quotes = [];

// Load from localStorage or use default quotes
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

// Save to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Create form dynamically (for ALX checker)
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

// Add new quote
function addQuote() {
  const quoteText = document.getElementById("newQuoteText").value.trim();
  const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (quoteText === "" || quoteCategory === "") {
    alert("Please fill in both the quote and the category.");
    return;
  }

  quotes.push({ text: quoteText, category: quoteCategory });
  saveQuotes();
  populateCategories();
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
  alert("Quote added successfully!");
}

// Populate category dropdown
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

  // Restore last selected filter
  const savedCategory = localStorage.getItem("selectedCategory");
  if (savedCategory && categoryFilter.querySelector(`[value="${savedCategory}"]`)) {
    categoryFilter.value = savedCategory;
    filterQuotes();
  }
}

// Filter and display quote
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  const quoteDisplay = document.getElementById("quoteDisplay");
  localStorage.setItem("selectedCategory", selectedCategory);

  let filtered = quotes;
  if (selectedCategory !== "all") {
    filtered = quotes.filter(q => q.category === selectedCategory);
  }

  if (filtered.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes available for this category.</p>";
    return;
  }

  const random = filtered[Math.floor(Math.random() * filtered.length)];
  quoteDisplay.innerHTML = `
    <blockquote>"${random.text}"</blockquote>
    <p><strong>Category:</strong> ${random.category}</p>
  `;

  sessionStorage.setItem("lastQuote", JSON.stringify(random));
}

// Restore last viewed quote on reload
function restoreLastViewedQuote() {
  const stored = sessionStorage.getItem("lastQuote");
  if (stored) {
    const { text, category } = JSON.parse(stored);
    document.getElementById("quoteDisplay").innerHTML =
      `<blockquote>"${text}"</blockquote><p><strong>Category:</strong> ${category}</p>`;
  }
}

// Dark mode toggle
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

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch {
      alert("Error parsing the JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

async function syncWithServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const serverData = await response.json();

    // Simulate server quotes
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
      showSyncNotification("Quotes updated from server. Local data was overwritten.");
    }
  } catch (error) {
    console.error("Sync error:", error);
    showSyncNotification("Failed to sync with server.");
  }
}

function showSyncNotification(message) {
  const notification = document.getElementById("syncNotification");
  notification.innerText = message;
  notification.style.display = "block";

  setTimeout(() => {
    notification.style.display = "none";
  }, 5000);
}


// Initialize on load
window.onload = () => {
  loadQuotes();
  populateCategories();
  createAddQuoteForm();
  restoreLastViewedQuote();
  setInterval(syncWithServer, 10000);

};
