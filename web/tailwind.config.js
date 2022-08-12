module.exports = {
    purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            boxShadow: {
                "md": "0px 2px 8px rgba(0, 0, 0, 0.1);",
            },
        },
        borderRadius: {
            none: "0",
            full: "2px",
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
