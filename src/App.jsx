import { useState } from 'react';

function App() {
  const [response, setResponse] = useState('');

  const callApi = async (method) => {
    try {
      const res = await fetch('https://restapi-production-a2b3.up.railway.app/api/register', {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: method === 'GET' ? null : JSON.stringify({
          name: 'masab',
          email: "masab@gmail.com",
          password: "Test@123"
        }),
      });

      const data = await res.json();
      setResponse(`${method} RESPONSE:\n` + JSON.stringify(data, null, 2));
    } catch (err) {
      setResponse(err.toString());
    }
  };

  return (
    <div className="App">
      <h1>CORS Test Client</h1>
      <button onClick={() => callApi('GET')}>GET</button>
      <button onClick={() => callApi('POST')}>POST</button>
      <button onClick={() => callApi('PUT')}>PUT</button>
      <button onClick={() => callApi('DELETE')}>DELETE</button>

      <pre>{response}</pre>
    </div>
  );
}

export default App;
