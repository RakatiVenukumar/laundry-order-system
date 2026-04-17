import React, { useState } from 'react';

const GARMENTS = [
  'Shirt',
  'Pants',
  'T-Shirt',
  'Jeans',
  'Jacket',
  'Kurta',
  'Saree',
  'Blouse',
  'Shorts',
  'Skirt',
  'Sweater',
  'Coat',
  'Dress',
  'Dupatta',
  'Towel',
  'Bedsheet',
  'Pillow Cover',
  'Blanket',
];

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length > 0) {
      const filtered = GARMENTS.filter(g => g.toLowerCase().includes(value.toLowerCase()));
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const handleSearch = () => {
    if (query.length === 0) {
      setResults([]);
      return;
    }
    const filtered = GARMENTS.filter(g => g.toLowerCase().includes(query.toLowerCase()));
    setResults(filtered);
    setSuggestions([]);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setResults([suggestion]);
    setSuggestions([]);
  };

  return (
    <div className="card" style={{maxWidth: 400, margin: '0 auto'}}>
      <h2>Search</h2>
      <div style={{position: 'relative'}}>
        <input
          type="text"
          placeholder="Search by garment type..."
          value={query}
          onChange={handleInputChange}
          style={{width: '100%', padding: '8px'}}
          onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
        />
        {suggestions.length > 0 && (
          <ul style={{
            position: 'absolute',
            left: 0,
            right: 0,
            background: '#fff',
            border: '1px solid #ddd',
            margin: 0,
            padding: 0,
            listStyle: 'none',
            zIndex: 10,
            maxHeight: 150,
            overflowY: 'auto',
          }}>
            {suggestions.map(s => (
              <li
                key={s}
                style={{padding: '8px', cursor: 'pointer'}}
                onClick={() => handleSuggestionClick(s)}
                onMouseDown={e => e.preventDefault()}
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>
      <button style={{marginTop: 12, width: '100%'}} onClick={handleSearch}>Search</button>
      <div style={{marginTop: 20}}>
        {results.length > 0 ? (
          <>
            <strong>Results:</strong>
            <ul>
              {results.map(r => <li key={r}>{r}</li>)}
            </ul>
          </>
        ) : (
          <p style={{color: '#888'}}>No results to display.</p>
        )}
      </div>
      <div style={{marginTop: '1rem'}}>
        <strong>Example:</strong> Try searching for "Shirt" or "Pants".
      </div>
    </div>
  );
}