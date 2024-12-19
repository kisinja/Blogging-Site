import { createContext } from "react";

export const AppContext = createContext();

const AppProvider = ({ children }) => {
    function formatTimeAgo(createdAt) {
        const now = new Date();
        const createdDate = new Date(createdAt);
        const seconds = Math.floor((now - createdDate) / 1000);

        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60,
            second: 1,
        };

        for (const [unit, value] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / value);
            if (interval >= 1) {
                return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
            }
        }

        return "just now";
    }

    const value = {
        formatTimeAgo,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export default AppProvider;