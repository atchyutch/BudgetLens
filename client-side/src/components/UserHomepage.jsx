import { useState, useEffect, useRef } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header.jsx';

function PlaidButton({ linkToken }) {
  const [islinked, setIsLinked] = useState(false);
  const navigate = useNavigate(); 
  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: async (public_token) => {
      try {
        await axios.post(
          'http://localhost:5500/plaid/exchange_public_token',
          { public_token },
          { withCredentials: true }
        );
        setIsLinked(true);
        if (!islinked) {
          alert('Account linked successfully!');
          // we will probably want to redirect the user to a different page
          // we will definitely update the UI, but once it is linked we wil go ti the new page.
          navigate("/dashboard");
        }
        console.log('Public token exchanged ✔');
      } catch (err) {
        console.error('Exchange failed:', err.response?.data || err);
      }
    },
  });

  return (
    <div className = "grid [grid-template-rows:100px_300px]">
      <Header />
      <div className ="mt-15 items-center justify-items-center">
        <h1 className="max-w-2xl flex justify-center align-middle font-semibold leading-snug
                 text-2xl sm:text-3xl md:text-4xl lg:text-3xl">Hey! Looks like you need a lens for your expenses to plan your future wisely. Why don't you start by connecting your bank account here safely!!</h1>
        <button
          onClick={open}
          disabled={!ready}
          className="flex justify-center mt-5 px-6 py-3 rounded-lg bg-black text-white hover:scale-[1.04] transition-transform hover:bg-gray-700">
          Link Account
        </button>
    </div>
    </div>
  );
}

export default function UserHomepage() {
  const [linkToken, setLinkToken] = useState(null);
  const [haveAccounts, setHaveAccounts] = useState(false);
  const fetchedRef = useRef(false);
  const jwt = localStorage.getItem('token');          // JWT saved at login

  useEffect(() => {
    if (fetchedRef.current) return;                   // run only once (React 18 strict)
    fetchedRef.current = true;

    (async () => {
      try {
        const res = await axios.post(
          'http://localhost:5500/plaid/create_link_token',
          {},
          {
            headers: { Authorization: `Bearer ${jwt}` },
            withCredentials: true,
          }
        );
        setLinkToken(res.data.link_token);
      } catch (err) {
        console.error(
          'Plaid create_link_token error:',
          err.response?.data || err
        );
      }
    })();
  }, [jwt]);

  if (!linkToken) {
    return (
      <button className="bg-gray-400 text-white py-2 rounded-md" disabled>
        Loading Plaid…
      </button>
    );
  }

  /* linkToken ready → mount child that uses usePlaidLink */
  return <PlaidButton linkToken={linkToken} />;
}
