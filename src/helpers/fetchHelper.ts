/**
 * Helper for working with requests
 * @param  {string} url
 * @return Promise
 */
export default async function fetchHelper(url: string) {
    const response = await fetch(url);
    if (response.ok) {
        return await response.json();
    }
}
