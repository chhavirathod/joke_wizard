import React, { useState, useEffect } from 'react';
import { Laugh, Search, ServerCrash, Wand2, PartyPopper } from 'lucide-react';

function App() {
  const [name, setName] = useState('');
  const [joke, setJoke] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [jokeFetched, setJokeFetched] = useState(false);

  useEffect(() => {
    if (jokeFetched) {
      document.body.className = 'bg-gradient-to-br from-amber-200 via-violet-400 to-sky-500';
    } else {
      document.body.className = 'bg-gray-100 dark:bg-gray-900';
    }
    return () => {
        document.body.className = 'bg-gray-100 dark:bg-gray-900';
    }
  }, [jokeFetched]);

  const fetchJoke = async (e) => {
    e.preventDefault();
    if (!name) {
      setError('Please enter your name to get a joke!');
      return;
    }

    setLoading(true);
    setError(null);
    setJoke(null);
    setJokeFetched(false);

    try {
      const response = await fetch(`https://v2.jokeapi.dev/joke/Any?`);
      
      if (!response.ok) {
        throw new Error('Something went wrong. Could not fetch a joke.');
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(`Sorry, couldn't find a joke with. Try another name!`);
      }
      
      setJoke(data);
      setJokeFetched(true);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const JokeContent = () => {
    if (!joke) return null;
    
    if (joke.type === 'single') {
      return <p className="text-lg md:text-xl text-center text-gray-700 dark:text-gray-200">{joke.joke}</p>;
    } else {
      return (
        <div className="text-center">
          <p className="text-lg md:text-xl mb-4 text-gray-700 dark:text-gray-200">{joke.setup}</p>
          <p className="text-xl md:text-2xl font-bold text-violet-600 dark:text-violet-400">{joke.delivery}</p>
        </div>
      );
    }
  };

  const style = document.createElement('style');
style.innerHTML = `
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  .animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
  }
`;
document.head.appendChild(style);


  return (
    <div className="w-screen min-h-screen flex flex-col items-center justify-center p-4 font-sans transition-colors duration-1000">
      <div className="w-full max-w-lg mx-auto bg-white/70 dark:bg-gray-800/50 backdrop-blur-lg rounded-3xl shadow-2xl shadow-violet-500/20 p-6 md:p-8 border border-gray-200 dark:border-gray-700">
        
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-2 animate-bounce">
            <PartyPopper size={36} className="text-amber-500" />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-pink-500">Joke Wizard</h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400">Enter your name for a personalized laugh!</p>
        </div>

        <form onSubmit={fetchJoke} className="flex flex-col sm:flex-row items-center gap-3 mb-6">
          <div className="relative w-full">
            <Wand2 size={20} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if(error) setError(null);
              }}
              placeholder="What's your name?"
              className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-[200px] flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 disabled:from-pink-400 disabled:to-orange-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Conjuring...</span>
              </>
            ) : (
              <>
                <Search size={20} />
                <span>Get Joke</span>
              </>
            )}
          </button>
        </form>

        <div className="min-h-[200px] flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-900/50 rounded-2xl">
          {error && (
            <div className="text-center text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-4 rounded-lg">
              <ServerCrash size={40} className="mx-auto mb-2" />
              <p className="font-semibold">{error}</p>
            </div>
          )}
          
          {jokeFetched && joke && (
             <div className="bg-white/80 dark:bg-gray-800/80 p-6 rounded-xl w-full animate-fade-in border border-gray-200 dark:border-gray-700 shadow-inner">
                <h2 className="text-xl font-semibold text-center mb-4 text-pink-600 dark:text-pink-400">Hey {name}, here's a joke for you!</h2>
                <hr className="border-gray-300 dark:border-gray-600 my-4" />
                <JokeContent />
            </div>
          )}

          {!jokeFetched && !error && !loading && (
             <div className="text-center text-gray-500 dark:text-gray-400">
                <p>Your joke will appear here. ✨</p>
             </div>
          )}
        </div>
      </div>
       <footer className="text-center mt-8 text-gray-600 dark:text-gray-400 text-sm">
        <p>Powered by <a href="https://jokeapi.dev/" target="_blank" rel="noopener noreferrer" className="text-violet-600 dark:text-violet-400 hover:underline">JokeAPI</a></p>
      </footer>
    </div>
  )
}

export default App
