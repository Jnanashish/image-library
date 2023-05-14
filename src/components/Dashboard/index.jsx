/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Gallery from "../Gallery";
import { getImages, getSearchedImage } from "../../Core/apiclient.js";
import styles from "./dashnoard.module.css";
import _ from "lodash";

function Dashboard() {
    const [imageData, setImageData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [apiError, setApiError] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [searchQueries, setSearchQueries] = useState([]);
    const [pageNo, setPageNo] = useState(1);

    // onintial load call the image list api
    useEffect(() => {
        getImageList();
    }, []);

    // implemented debouce to make api call on searched term
    const delayedSearch = _.debounce(() => {
        loadSearchedImage();
    }, 800);

    useEffect(() => {
        if (searchTerm.length > 0) {
            setImageData([]);
            delayedSearch(searchTerm);
        }
        return delayedSearch.cancel;
    }, [searchTerm]);

    // handle infinite scroll
    window.onscroll = () => {
        if (
            !showLoader &&
            window.innerHeight + document.documentElement.scrollTop + 200 >
                document.documentElement.offsetHeight
        ) {
            setPageNo((prevstate) => prevstate + 1);
            if (searchTerm.length > 1) loadSearchedImage(pageNo + 1);
            else getImageList(pageNo + 1);
        }
    };

    const handleQuerySelect = (query) => {
        setSearchTerm(query);
    };

    // make api call to load image with searched query
    const loadSearchedImage = (pageNo) => {
        if (!searchTerm.trim()) {
            return;
        }
        setSearchQueries([...searchQueries, searchTerm.trim()]);
        setShowLoader(true);
        setNotFound(false);
        getSearchedImage(searchTerm, pageNo)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setShowLoader(false);
                if (data.photos.photo.length === 0) setNotFound(true);
                return setImageData([...imageData, ...data.photos.photo]);
            })
            .catch((error) => setApiError(true));
    };

    // make api call to get list of images on intial load
    const getImageList = (pageNo) => {
        setShowLoader(true);
        getImages(pageNo)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setShowLoader(false);
                setImageData([...imageData, ...data.photos.photo]);
            })
            .catch((error) => setApiError(true));
    };

    const clearSearchKeyword = () => {
        setSearchTerm("");
        setImageData([]);
        setPageNo(1);
        getImageList(1);
    };

    return (
        <div>
            {/* header with search container  */}
            <div className={styles.seach_container}>
                <p>Search Photos</p>
                <div className={styles.input_con}>
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.input_container}
                        placeholder="Enter any keyword"
                    />
                    <p onClick={() => clearSearchKeyword()} className={styles.cancelButton}>
                        {searchTerm.length > 1 ? "x" : ""}
                    </p>
                </div>
                {searchQueries.length > 0 && false && (
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

            {imageData.length > 0 && <Gallery data={imageData} />}

            {/* error block to show error or not found message  */}
            {(apiError || notFound) && (
                <div className={styles.error_container}>
                    {apiError ? "Cannot load data 😔" : "Please try differnet query"}
                </div>
            )}

            {(showLoader || imageData.length === 0) && (
                <div className={styles.error_container}>Loading ...</div>
            )}
        </div>
    );
}

export default Dashboard;
