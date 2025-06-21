import { createContext, useContext } from 'react';

// Create the context
const CountdownContext = createContext();

// Countdown provider component
export const CountdownProvider = ({ children }) => {
    // Registration is always active, so we just pass true.
    const value = {
        isActive: true,
        isComing: false,
        isEnded: false,
        timeLeft: {},
    };

    return (
        <CountdownContext.Provider value={value}>
            {children}
        </CountdownContext.Provider>
    );
};

// Custom hook to use the countdown context
export const useCountdown = () => useContext(CountdownContext);
