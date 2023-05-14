import "./App.css";
import { useEffect } from "react";
import Dashboard from "./components/Dashboard";

function App() {
    const callPhoto = () => {
        const url = "https://api.flickr.com/services/rest";
        const apiKey = "a6646865e3024740c83fe03d80322fc7";

        const params = new URLSearchParams({
            method: "flickr.photos.getRecent",
            api_key: apiKey,
            format: "json",
            nojsoncallback: 1,
        });

        fetch(`${url}?${params}`)
            .then((response) => response.json())
            .then((data) => console.log(data))
            .catch((error) => console.error(error));
    };
    useEffect(() => {
        // callPhoto();
    }, []);
    return (
        <div className="App">
            <Dashboard />
        </div>
    );
}

export default App;
