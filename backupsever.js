// Backend for Think Digital Website using MERN Stack

// 1. Import Dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors'); // To handle Cross-Origin requests

// Load environment variables
dotenv.config();

// Initialize Express App
const app = express();

// Middleware
app.use(bodyParser.json()); // Parse incoming JSON requests
app.use(cors()); // Enable CORS

// 2. Connect to MongoDB
console.log('Mongo URI from .env:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// 3. Define MongoDB Schemas and Models
const MemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  role: { type: String, required: true }
});

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  attendees: [String] // Array of member names
});

const WorkshopSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  speaker: { type: String, required: true },
  date: { type: Date, required: true }
});

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const ResourceSchema = new mongoose.Schema({
  downloads: [
    {
      title: String,
      link: String,
      filename: String
    }
  ],
  links: [
    {
      title: String,
      url: String
    }
  ]
});

const ContactSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  date: { type: Date, default: Date.now }
});

const Member = mongoose.model('Member', MemberSchema);
const Event = mongoose.model('Event', EventSchema);
const Workshop = mongoose.model('Workshop', WorkshopSchema);
const Blog = mongoose.model('Blog', BlogSchema);
const Resource = mongoose.model('Resource', ResourceSchema);
const Contact = mongoose.model('Contact', ContactSchema);

// 4. Define Routes
// Home route
app.get('/', (req, res) => {
  res.send('Welcome to the Think Digital API');
});

// Members routes
// Add a new member
app.post('/members', async (req, res) => {
  const { name, contact, role } = req.body;
  try {
    const newMember = new Member({ name, contact, role });
    await newMember.save();
    res.status(201).json({ message: 'Member added successfully', member: newMember });
  } catch (error) {
    console.error('Error adding member:', error);
    res.status(500).json({ message: 'Error adding member', error: error.message });
  }
});

// List all members
app.get('/members', async (req, res) => {
  try {
    const members = await Member.find();
    res.status(200).json(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ message: 'Error fetching members', error: error.message });
  }
});

// Events routes
// Add a new event
app.post('/events', async (req, res) => {
  const { title, description, date, attendees } = req.body;

  // Validate required fields
  if (!title || !description || !date) {
    return res.status(400).json({ message: 'Title, description, and date are required' });
  }

  try {
    const newEvent = new Event({ title, description, date, attendees });
    await newEvent.save();
    res.status(201).json({ message: 'Event added successfully', event: newEvent });
  } catch (error) {
    console.error('Error adding event:', error);
    res.status(500).json({ message: 'Error adding event', error: error.message });
  }
});

// List all events
app.get('/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
});

// Workshops routes
// Add a new workshop
app.post('/workshops', async (req, res) => {
  const { title, description, speaker, date } = req.body;

  // Validate required fields
  if (!title || !description || !speaker || !date) {
    return res.status(400).json({ message: 'Title, description, speaker, and date are required' });
  }

  try {
    const newWorkshop = new Workshop({ title, description, speaker, date });
    await newWorkshop.save();
    res.status(201).json({ message: 'Workshop added successfully', workshop: newWorkshop });
  } catch (error) {
    console.error('Error adding workshop:', error);
    res.status(500).json({ message: 'Error adding workshop', error: error.message });
  }
});

// List all workshops
app.get('/workshops', async (req, res) => {
  try {
    const workshops = await Workshop.find().sort({ date: 1 });
    res.status(200).json(workshops);
  } catch (error) {
    console.error('Error fetching workshops:', error);
    res.status(500).json({ message: 'Error fetching workshops', error: error.message });
  }
});

// Blogs routes
// Add a new blog post
app.post('/blogs', async (req, res) => {
  const { title, content } = req.body;

  // Validate required fields
  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  try {
    const newBlog = new Blog({ title, content });
    await newBlog.save();
    res.status(201).json({ message: 'Blog post added successfully', blog: newBlog });
  } catch (error) {
    console.error('Error adding blog post:', error);
    res.status(500).json({ message: 'Error adding blog post', error: error.message });
  }
});

// List all blog posts
app.get('/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ message: 'Error fetching blog posts', error: error.message });
  }
});

// Resources routes
// Add or update resources
app.post('/resources', async (req, res) => {
  const { downloads, links } = req.body;

  try {
    let resource = await Resource.findOne();
    if (!resource) {
      resource = new Resource({ downloads: [], links: [] });
    }

    if (downloads && Array.isArray(downloads)) {
      resource.downloads = downloads;
    }

    if (links && Array.isArray(links)) {
      resource.links = links;
    }

    await resource.save();
    res.status(200).json({ message: 'Resources updated successfully', resource });
  } catch (error) {
    console.error('Error updating resources:', error);
    res.status(500).json({ message: 'Error updating resources', error: error.message });
  }
});

// Get resources
app.get('/resources', async (req, res) => {
  try {
    const resources = await Resource.findOne();
    res.status(200).json(resources || { downloads: [], links: [] });
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ message: 'Error fetching resources', error: error.message });
  }
});

// Contact routes
// Handle contact form submissions
app.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Validate required fields
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newContact = new Contact({ name, email, subject, message });
    await newContact.save();
    res.status(201).json({ message: 'Your message has been sent successfully.' });
  } catch (error) {
    console.error('Error handling contact form:', error);
    res.status(500).json({ message: 'Error sending your message', error: error.message });
  }
});

// Latest Updates routes (for Home Page Carousel)
app.get('/latest-updates', async (req, res) => {
  // This can fetch recent events, blog posts, or announcements
  try {
    const latestEvents = await Event.find().sort({ date: 1 }).limit(5);
    const latestBlogs = await Blog.find().sort({ createdAt: -1 }).limit(5);

    res.status(200).json([
      ...latestEvents.map(event => ({ title: event.title, description: event.description })),
      ...latestBlogs.map(blog => ({ title: blog.title, description: blog.content.slice(0, 100) + "..." }))
    ]);
  } catch (error) {
    console.error('Error fetching latest updates:', error);
    res.status(500).json({ message: 'Error fetching latest updates', error: error.message });
  }
});

// 5. Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
