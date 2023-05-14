import React, { useEffect, useState } from "react";
import Gallery from "../Gallery";
import { getImages, getSearchedImage } from "../../Core/apiclient.js";
import styles from "./dashnoard.module.css";
import _ from "lodash";

function Dashboard() {
    const [imageData, setImageData] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [apiError, setApiError] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [searchQueries, setSearchQueries] = useState([]);

    useEffect(() => {
        getImageList();
    }, []);

    useEffect(() => {
        const savedQueries = JSON.parse(localStorage.getItem("searchQueries")) || [];
        setSearchQueries(savedQueries);
    }, []);
    useEffect(() => {
        localStorage.setItem("searchQueries", JSON.stringify(searchQueries));
    }, [searchQueries]);

    // implemented debouce to make api call on searched term
    const delayedSearch = _.debounce(() => {
        if (searchTerm.length > 0) loadSearchedImage();
    }, 800);

    useEffect(() => {
        delayedSearch(searchTerm);
        return delayedSearch.cancel;
    }, [searchTerm]);

    const loadSearchedImage = () => {
        if (!searchTerm.trim()) {
            return;
        }
        setSearchQueries([...searchQueries, searchTerm.trim()]);

        setShowLoader(true);
        setImageData(null);
        setNotFound(false);
        getSearchedImage(searchTerm)
            .then((response) => {
                setShowLoader(false);
                setSearchTerm("");
                return response.json();
            })
            .then((data) => {
                if (data.photos.photo.length === 0) setNotFound(true);
                return setImageData(data.photos.photo);
            })
            .catch((error) => setApiError(true));
    };

    const handleQuerySelect = (query) => {
        setSearchTerm(query);
    };

    // make api call to get list of images on intial load
    const getImageList = () => {
        getImages()
            .then((response) => {
                setShowLoader(false);
                return response.json();
            })
            .then((data) => setImageData(data.photos.photo))
            .catch((error) => setApiError(true));
    };

    return (
        <div>
            {/* header with search container  */}
            <div className={styles.seach_container}>
                <p>Search Photos</p>
                <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.input_container}
                    placeholder="Enter any keyword"
                />
                {searchQueries.length > 0 && (
                    <div className={styles.search_suggestions}>
                        {searchQueries.map((query, index) => (
                            <p
                                className={styles.search_suggestions_text}
                                key={index}
                                onClick={() => handleQuerySelect(query)}>
                                {query}
                            </p>
                        ))}
                    </div>
                )}
            </div>

            <Gallery data={imageData} />

            {/* error block to show error or not found message  */}
            {(apiError || notFound) && (
                <div className={styles.error_container}>
                    {apiError ? "Cannot load data 😔" : "Please try differnet query"}
                </div>
            )}

            {showLoader && <div className={styles.error_container}>Loading ...</div>}
        </div>
    );
}

export default Dashboard;
