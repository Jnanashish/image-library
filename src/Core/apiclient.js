const url = "https://api.flickr.com/services/rest";
const apiKey = "a6646865e3024740c83fe03d80322fc7";

export const getImages = async () => {
    const params = new URLSearchParams({
        method: "flickr.photos.getRecent",
        api_key: apiKey,
        format: "json",
        nojsoncallback: 1,
        per_page: 1,
        page: 1,
    });

    const apiResponse = await fetch(`${url}?${params}`);
    return apiResponse;
};

export const getSearchedImage = async (searchedTerm) => {
    const params = new URLSearchParams({
        method: "flickr.photos.search",
        api_key: apiKey,
        text: searchedTerm,
        format: "json",
        nojsoncallback: 1,
        per_page: 1,
        page: 1,
    });
    const apiResponse = await fetch(`${url}?${params}`);
    return apiResponse;
};
