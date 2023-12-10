import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';

function App() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch('https://roc8l2apiurl.onrender.com/api/books');
      const data = await response.json();
      setBooks(data);
      console.log(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const submitForm = async () => {
    try {
      const response = await fetch('https://roc8l2apiurl.onrender.com/api/add-book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, author, year }),
      });

      const data = await response.json();

      setBooks([...books, data]);

      setTitle('');
      setAuthor('');
      setYear('');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://roc8l2apiurl.onrender.com/api/delete-book/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok)
       {
  
        fetchBooks();
      } else {
        console.error('Error deleting book:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  return (
    <div className="App mt-4">

      <Container>
        <h2 className="text-center mb-4">Book Library</h2>
        <Row className="justify-content-md-center">
          <Col md="8">
            <Form noValidate>
              <Row className="mb-3">
                <Col md="3" className='mt-1'>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Book Title"
                    value={title} onChange={(e) => setTitle(e.target.value)}
                  />
                </Col>
                <Col md="4" className='mt-1'>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Author"
                    value={author} onChange={(e) => setAuthor(e.target.value)}
                  />
                </Col>
                <Col md="3" className='mt-1'>
                  <InputGroup hasValidation>
                    <Form.Control
                      type="text"
                      placeholder="Published Year"
                      value={year} onChange={(e) => setYear(e.target.value)}
                    />
                  </InputGroup>
                </Col>
                <Col md="2">
                  <Button type="submit" onClick={submitForm} className="w-100">
                    Add book
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Container>

      <Container>
        <Row className="justify-content-md-center">
          <Col md="8">
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Year of Publication</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book._id}>
                    <td>{book._id}</td>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.year}</td>
                    <td>
                      <Button variant="danger" onClick={() => handleDelete(book._id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>

    </div>
  );
}

export default App;
