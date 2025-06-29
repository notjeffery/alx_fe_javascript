// Initial quotes with motivational categories
const quotes = [
  { text: "Believe you can and you're halfway there.", category: "Confidence" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" },
  { text: "What you get by achieving your goals is not as important as what you become by achieving your goals.", category: "Growth" },
  { text: "The best way to get started is to quit talking and begin doing.", category: "Inspiration" },
  { text: "Don’t let yesterday take up too much of today.", category: "Perseverance" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categoryFilter = document.getElementById("categoryFilter");
const darkModeToggle = document.getElementById("darkModeToggle");

// Populate the category dropdown
function populateCategoryDropdown() {
  const existingOptions = Array.from(categoryFilter.options).map(opt => opt.value);
  const categories = [...new Set(quotes.map(q => q.category))];

  categories.forEach(category => {
    if (!existingOptions.includes(category)) {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    }
  });
}

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


// Show a random quote, optionally filtered by category
function showRandomQuote() {
  const selectedCategory = categoryFilter.value;
  let filteredQuotes = quotes;

  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = "<p>No quotes available for this category.</p>";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const { text, category } = filteredQuotes[randomIndex];

  quoteDisplay.innerHTML = `
    <blockquote>"${text}"</blockquote>
    <p><strong>Category:</strong> ${category}</p>
  `;
}

// Add a new quote and refresh dropdown
function addQuote() {
  const quoteText = document.getElementById("newQuoteText").value.trim();
  const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (quoteText === "" || quoteCategory === "") {
    alert("Please fill in both the quote and the category.");
    return;
  }

  quotes.push({ text: quoteText, category: quoteCategory });
  populateCategoryDropdown(); // Refresh category list

  // Clear inputs
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  alert("Quote added successfully!");
}

// Dark mode toggle
darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// Event listeners
newQuoteBtn.addEventListener("click", showRandomQuote);
categoryFilter.addEventListener("change", showRandomQuote);

// On page load
window.onload = () => {
  populateCategoryDropdown();
  createAddQuoteForm();
  showRandomQuote();
};
