const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 8080;

app.use(bodyParser.json());
app.use(cors());

const mongoURI = "mongodb+srv://Rohith:ziBBdZYECRctUQRu@cluster0.4hsfven.mongodb.net/booktest?retryWrites=true&w=majority"

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));


const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  year: Number
});


const Book = mongoose.model('Book', bookSchema);

app.get('/api/books', async (req, res) => {
  try {
    const books = await Book.find({});
    res.json(books);
  } catch (error) {
    console.error('Error retrieving books from MongoDB:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/test', async (req, res) => {
    res.json({ message: 'Hello, world!' });
  });
  
app.post('/api/add-book', async (req, res) => {
  try {
    const { title, author, year } = req.body;
    
    // Create a new instance of the Book model
    const newBook = new Book({ title, author, year });

    // Save the new book to the database
    const savedBook = await newBook.save();

    res.json(savedBook);
  } catch (error) {
    console.error('Error adding book to MongoDB:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.delete('/api/delete-book/:id', async (req, res) => {
    try {
      const bookId = req.params.id;
      const deletedBook = await Book.findByIdAndDelete(bookId);
  
      if (!deletedBook) {
        res.status(404).json({ error: 'Book not found' });
        return;
      }
  
      res.json(deletedBook);
    } catch (error) {
      console.error('Error deleting book from MongoDB:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
