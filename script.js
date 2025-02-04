// Backend API URLs
const API_BASE_URL = "http://localhost:5000"; // Adjust based on your backend's URL

// Utility function to fetch data
async function fetchData(endpoint) {
  try {
    const response = await fetch(`${API_BASE_URL}/${endpoint}`);
    if (!response.ok) throw new Error(`Failed to fetch ${endpoint}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return null;
  }
}

// Load Events
async function loadEvents() {
  const eventsContainer = document.getElementById("events-container");
  const events = await fetchData("events");

  if (!events) {
    eventsContainer.innerHTML = "<p>Error loading events.</p>";
    return;
  }

  if (events.length === 0) {
    eventsContainer.innerHTML = "<p>No upcoming events at the moment.</p>";
    return;
  }

  eventsContainer.innerHTML = events
    .map(event => `
      <div class="event">
        <h3>${event.title}</h3>
        <p>${event.description}</p>
        <p><strong>Date:</strong> ${new Date(event.date).toLocaleString()}</p>
        <p><strong>Attendees:</strong> ${event.attendees.join(", ")}</p>
      </div>
    `)
    .join("");
}
// ... [Existing Code Above]

// Handle Newsletter Subscription
const newsletterForm = document.getElementById("newsletter-form");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("newsletter-email").value;

    try {
      const response = await fetch(`${API_BASE_URL}/subscribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        newsletterForm.reset();
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      alert("An error occurred while subscribing.");
    }
  });
}

// Dark Mode Toggle
const darkModeToggle = document.getElementById("dark-mode-toggle");
if (darkModeToggle) {
  darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    document.querySelectorAll('header, nav, footer').forEach(el => el.classList.toggle("dark-mode"));
  });
}

// Handle Login
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();
      if (response.ok) {
        localStorage.setItem("authToken", result.token);
        alert("Login successful!");
        window.location.href = "members.html"; // Redirect to members page
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("An error occurred while logging in.");
    }
  });
}

// Simple Authentication (For Demonstration Purposes)
const adminUsername = "admin";
const adminPassword = "password123"; // In production, use a secure method

function isAdminLoggedIn() {
  return localStorage.getItem("adminLoggedIn") === "true";
}

function showAdminSections() {
  const adminSections = document.querySelectorAll(".admin-only");
  adminSections.forEach(section => {
    section.style.display = "block";
  });
}

function hideAdminSections() {
  const adminSections = document.querySelectorAll(".admin-only");
  adminSections.forEach(section => {
    section.style.display = "none";
  });
}

function promptAdminLogin() {
  const username = prompt("Enter admin username:");
  const password = prompt("Enter admin password:");

  if (username === adminUsername && password === adminPassword) {
    localStorage.setItem("adminLoggedIn", "true");
    showAdminSections();
    alert("Admin login successful.");
  } else {
    alert("Invalid credentials. Admin sections will remain hidden.");
    hideAdminSections();
  }
}

// Initialize the page based on the current HTML file
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname.split("/").pop();

  switch (path) {
    case "index.html":
      loadLatestUpdates();
      break;
    case "events.html":
      loadEvents();
      break;
    case "members.html":
      loadMembers();
      break;
    case "workshops.html":
      loadWorkshops();
      break;
    case "blog.html":
      loadBlogs();
      break;
    case "resources.html":
      loadResources();
      break;
    default:
      break;
  }

  // Show admin sections if logged in
  if (isAdminLoggedIn()) {
    showAdminSections();
  } else {
    // Prompt for admin login on pages with admin sections
    if (document.querySelector(".admin-only")) {
      promptAdminLogin();
    }
  }

  // ... [Existing Form Submission Code Below]
});

// Load Members
async function loadMembers() {
  const membersContainer = document.getElementById("members-container");
  const members = await fetchData("members");

  if (!members) {
    membersContainer.innerHTML = "<p>Error loading members.</p>";
    return;
  }

  if (members.length === 0) {
    membersContainer.innerHTML = "<p>No members found.</p>";
    return;
  }

  membersContainer.innerHTML = members
    .map(member => `
      <div class="member">
        <h3>${member.name}</h3>
        <p><strong>Role:</strong> ${member.role}</p>
        <p><strong>Contact:</strong> ${member.contact}</p>
      </div>
    `)
    .join("");
}

// Load Workshops
async function loadWorkshops() {
  const workshopsContainer = document.getElementById("workshops-container");
  const workshops = await fetchData("workshops"); // Ensure you have this endpoint

  if (!workshops) {
    workshopsContainer.innerHTML = "<p>Error loading workshops.</p>";
    return;
  }

  if (workshops.length === 0) {
    workshopsContainer.innerHTML = "<p>No upcoming workshops.</p>";
    return;
  }

  workshopsContainer.innerHTML = workshops
    .map(workshop => `
      <div class="workshop">
        <h3>${workshop.title}</h3>
        <p>${workshop.description}</p>
        <p><strong>Speaker:</strong> ${workshop.speaker}</p>
        <p><strong>Date:</strong> ${new Date(workshop.date).toLocaleString()}</p>
      </div>
    `)
    .join("");
}

// Load Blogs
async function loadBlogs() {
  const blogsContainer = document.getElementById("blogs-container");
  const blogs = await fetchData("blogs"); // Ensure you have this endpoint

  if (!blogs) {
    blogsContainer.innerHTML = "<p>Error loading blog posts.</p>";
    return;
  }

  if (blogs.length === 0) {
    blogsContainer.innerHTML = "<p>No blog posts available.</p>";
    return;
  }

  blogsContainer.innerHTML = blogs
    .map(blog => `
      <div class="blog-post">
        <h3>${blog.title}</h3>
        <p>${blog.content}</p>
        <p><em>Posted on: ${new Date(blog.createdAt).toLocaleDateString()}</em></p>
      </div>
    `)
    .join("");
}

// Load Resources
async function loadResources() {
  const resourcesContainer = document.getElementById("resources-container");
  const resources = await fetchData("resources"); // Ensure you have this endpoint

  if (!resources) {
    resourcesContainer.innerHTML = "<p>Error loading resources.</p>";
    return;
  }

  if (resources.downloads.length === 0) {
    resourcesContainer.innerHTML = "<p>No downloadable content available.</p>";
  } else {
    resourcesContainer.innerHTML = resources.downloads
      .map(download => `
        <div class="download">
          <h4>${download.title}</h4>
          <a href="${download.link}" download>${download.filename}</a>
        </div>
      `)
      .join("");
  }

  if (resources.links.length === 0) {
    document.getElementById("links-container").innerHTML = "<p>No curated links available.</p>";
  } else {
    document.getElementById("links-container").innerHTML = resources.links
      .map(link => `<li><a href="${link.url}" target="_blank">${link.title}</a></li>`)
      .join("");
  }
}

// Load Latest Updates (Home Page Carousel)
async function loadLatestUpdates() {
  const carousel = document.querySelector(".carousel");
  const updates = await fetchData("latest-updates"); // Ensure you have this endpoint

  if (!updates || updates.length === 0) {
    carousel.innerHTML = "<p>No updates available.</p>";
    return;
  }

  carousel.innerHTML = updates
    .map(update => `
      <div class="carousel-item">
        <h3>${update.title}</h3>
        <p>${update.description}</p>
      </div>
    `)
    .join("");
}

// Initialize the page based on the current HTML file
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname.split("/").pop();

  switch (path) {
    case "index.html":
      loadLatestUpdates();
      break;
    case "events.html":
      loadEvents();
      break;
    case "members.html":
      loadMembers();
      break;
    case "workshops.html":
      loadWorkshops();
      break;
    case "blog.html":
      loadBlogs();
      break;
    case "resources.html":
      loadResources();
      break;
    default:
      break;
  }

  // Handle Form Submissions
  const memberForm = document.getElementById("member-form");
  if (memberForm) {
    memberForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value;
      const contact = document.getElementById("contact").value;
      const role = document.getElementById("role").value;

      try {
        const response = await fetch(`${API_BASE_URL}/members`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, contact, role }),
        });

        const result = await response.json();
        if (response.ok) {
          alert(result.message);
          memberForm.reset();
          loadMembers(); // Refresh member list
        } else {
          alert(`Error: ${result.message}`);
        }
      } catch (error) {
        console.error("Error adding member:", error);
        alert("An error occurred while adding the member.");
      }
    });
  }

  const eventForm = document.getElementById("event-form");
  if (eventForm) {
    eventForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const title = document.getElementById("title").value;
      const description = document.getElementById("description").value;
      const date = document.getElementById("date").value;
      const attendees = document.getElementById("attendees").value.split(",").map(a => a.trim());

      try {
        const response = await fetch(`${API_BASE_URL}/events`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, description, date, attendees }),
        });

        const result = await response.json();
        if (response.ok) {
          alert(result.message);
          eventForm.reset();
          loadEvents(); // Refresh events list
        } else {
          alert(`Error: ${result.message}`);
        }
      } catch (error) {
        console.error("Error adding event:", error);
        alert("An error occurred while adding the event.");
      }
    });
  }

  const workshopForm = document.getElementById("workshop-form");
  if (workshopForm) {
    workshopForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const title = document.getElementById("title").value;
      const description = document.getElementById("description").value;
      const speaker = document.getElementById("speaker").value;
      const date = document.getElementById("date").value;

      try {
        const response = await fetch(`${API_BASE_URL}/workshops`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, description, speaker, date }),
        });

        const result = await response.json();
        if (response.ok) {
          alert(result.message);
          workshopForm.reset();
          loadWorkshops(); // Refresh workshops list
        } else {
          alert(`Error: ${result.message}`);
        }
      } catch (error) {
        console.error("Error adding workshop:", error);
        alert("An error occurred while adding the workshop.");
      }
    });
  }

  const blogForm = document.getElementById("blog-form");
  if (blogForm) {
    blogForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const title = document.getElementById("title").value;
      const content = document.getElementById("content").value;

      try {
        const response = await fetch(`${API_BASE_URL}/blogs`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, content }),
        });

        const result = await response.json();
        if (response.ok) {
          alert(result.message);
          blogForm.reset();
          loadBlogs(); // Refresh blog list
        } else {
          alert(`Error: ${result.message}`);
        }
      } catch (error) {
        console.error("Error adding blog post:", error);
        alert("An error occurred while adding the blog post.");
      }
    });
  }

  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const subject = document.getElementById("subject").value;
      const message = document.getElementById("message").value;

      try {
        const response = await fetch(`${API_BASE_URL}/contact`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, subject, message }),
        });

        const result = await response.json();
        if (response.ok) {
          alert(result.message);
          contactForm.reset();
        } else {
          alert(`Error: ${result.message}`);
        }
      } catch (error) {
        console.error("Error sending message:", error);
        alert("An error occurred while sending your message.");
      }
    });
  }
});
