import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNylas } from '@nylas/nylas-react';

const Connection = ({ email, setEmail }) => {
  const nylas = useNylas();

  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Check if the user is already connected
    if (nylas && nylas.accessToken) {
      setIsConnected(true);
    }
  }, [nylas]);

  const loginUser = (e) => {
    e.preventDefault();
    setIsLoading(true);
    sessionStorage.setItem('userEmail', email);

    nylas.authWithRedirect({
      emailAddress: email,
      successRedirectUrl: '',
    });
  };

  return (
    <section className="login">
      {isConnected ? (
        <div className="connected-successfully">Connected successfully</div>
      ) : (
        <form onSubmit={loginUser}>
          <input
            required
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Connecting...' : 'Connect email'}
          </button>
        </form>
      )}
    </section>
  );
};

Connection.propTypes = {
  email: PropTypes.string.isRequired,
  setEmail: PropTypes.func.isRequired,
};

export default Connection;
