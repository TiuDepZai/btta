// pages/index.js
import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

export default function Home() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounceTimeout = useRef(null);

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    if (!search) {
      setResults([]);
      return;
    }

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      fetchResults(search);
    }, 500);

    return () => clearTimeout(debounceTimeout.current);
  }, [search]);

  const fetchResults = async (query) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/player?name=${encodeURIComponent(query)}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Fetch error:', error);
      setResults([]);
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.searchWrapper}>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={handleChange}
          style={styles.input}
        />
        <FontAwesomeIcon icon={faMagnifyingGlass} style={styles.icon} />
      </div>

      {search && <p>Search term: <strong>{search}</strong></p>}
      {loading && <p>Loading...</p>}

      <ul style={styles.list}>
        {results.map((row, idx) => (
          <li key={idx}>{row.join(' | ')}</li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'sans-serif',
    padding: '2rem',
    textAlign: 'center',
  },
  searchWrapper: {
    position: 'relative',
    width: 'fit-content',
    margin: '0 auto 1rem auto',
  },
  input: {
    padding: '8px 32px 8px 10px',
    fontSize: '16px',
    borderRadius: '24px',
    outline: 'none',
    border: '2px solid #3498db',
    color: '#3498db',
    width: '200px',
    background: 'transparent',
  },
  icon: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#3498db',
    pointerEvents: 'none',
    fontSize: '16px',
  },
  list: {
    listStyle: 'none',
    paddingLeft: 0,
    marginTop: '1rem',
  },
};
