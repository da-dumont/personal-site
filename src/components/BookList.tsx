import React from 'react';
import React, { useState, useEffect } from 'react';

interface Author {
  name: string;
}

interface BookData {
  title: string;
  authors: Author[];
  // Add more properties as needed
}

interface BookInfoProps {
  isbn: string;
}

const BookInfo: React.FC<BookInfoProps> = ({ isbn }) => {
  const [bookData, setBookData] = useState<BookData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const response = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json`);
        const data = await response.json();
        setBookData(data[`ISBN:${isbn}`]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching book data:', error);
        setLoading(false);
      }
    };

    fetchBookData();
  }, [isbn]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        bookData ? (
          <div>
            <h2>{bookData.title}</h2>
            <p>Author(s): {bookData.authors.map((author) => author.name).join(', ')}</p>
            {/* Add more book information as needed */}
          </div>
        ) : (
          <p>No information available for the provided ISBN.</p>
        )
      )}
    </div>
  );
};

export default BookInfo;
