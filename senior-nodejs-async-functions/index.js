const timeout = 100;

const ads = [
    {id: 1, impressionId: 1},
    {id: 2, impressionId: 2},
    {id: 3, impressionId: 3},
    {id: 4, impressionId: 4}
]
const getAllAdsIds = () => new Promise((resolve, reject) => setTimeout(resolve(ads.map(ad => ad.id)), timeout));

const impressions = [
    {id: 1, impressions: 1000},
    {id: 2, impressions: 2000},
    {id: 3, impressions: 3000},
    {id: 4, impressions: 4000}
]
const getAdById = (adId) => {
    return new Promise((resolve, reject) => {
        return setTimeout(() => resolve(ads.filter(ad => ad.id === adId)[0]), timeout*2)
    })
}
const getAdImpression = (impressionId) => {
    return new Promise((resolve, reject) => {
        return setTimeout(() => resolve(impressions.filter(impression => impression.id === impressionId)[0]), timeout)
    })
}
const getAllImpressions = async () => {
    const adIds = await getAllAdsIds();
    const startTime = Date.now();
    for (let adId of adIds) {
        const ad = await getAdById(adId);
        console.log("ad: ", ad);
        const adImpressions = await getAdImpression(ad.impressionId);
        console.log("adImpressions: ", adImpressions);
    }
    const endTime = Date.now();
    console.log("execution time: ", endTime - startTime);
}

/* 
    Solution:
    - Preffered usage of async await for readability, as long as task have to be executed sequentially
    - Promise.all for parallel execution
    - Meaningul logs in production (Logs slow down execution time by ~20s here)

    Comment:
    - If we knew that all ads and all impressions will be needed, also running these requests in parallel would be possible
    - I assumed that in a real situation we *need* to wait for the ads, to be able to refer to the impression

    Thank you for reviewing!
*/
const getAddImpression = async (adId) => {
    try {
        const ad = await getAdById(adId);
        const impression = await getAdImpression(ad.impressionId);
        return {ad, impression};
    } catch(error) {
        return error;
    }
}

const getAllImpressionsPerf = async () => {
    const adIds = await getAllAdsIds();
    const startTime = Date.now();

    const addImpressions = await Promise.all(adIds.map(adId => {
        return getAddImpression(adId);
    }))

    addImpressions.forEach(addImpression => {
        console.log("ad: ", addImpression.ad);
        console.log("adImpressions: ", addImpression.impression);
    })

    const endTime = Date.now();
    console.log("execution time: ", endTime - startTime);
}

//getAllImpressions();
getAllImpressionsPerf();