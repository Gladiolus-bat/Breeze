import { createContext, useContext, useState } from "react";

const NavContext = createContext(null);

export const NavProvider = ({children}) => {
    const [view, setView] = useState({name: "home"});

    const navigate = (name, params = {}) => {
        setView({name, ...params});
        window.scrollTo(0, 0);
    };

    return (
        <NavContext.Provider value = {{view, navigate}}>
            {children}
        </NavContext.Provider>
    );
};

export const useNav = () => {
    const ctx = useContext(NavContext);
    if (!ctx) throw new Error ("useNav must be within a NavProvider");
    return ctx;
};