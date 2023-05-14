const url = "https://api.flickr.com/services/rest";
const apiKey = process.env.REACT_APP_API_KEY;

// get list of images based on page no
export const getImages = async (pageNo) => {
    const params = new URLSearchParams({
        method: "flickr.photos.getRecent",
        api_key: apiKey,
        format: "json",
        nojsoncallback: 1,
        per_page: 10,
        page: pageNo,
    });

    const apiResponse = await fetch(`${url}?${params}`);
    return apiResponse;
};

// get searched image based on searched term and page no
export const getSearchedImage = async (searchedTerm, pageNo) => {
    const params = new URLSearchParams({
        method: "flickr.photos.search",
        api_key: apiKey,
        text: searchedTerm,
        format: "json",
        nojsoncallback: 1,
        per_page: 10,
        page: pageNo,
    });
    const apiResponse = await fetch(`${url}?${params}`);
    return apiResponse;
};
