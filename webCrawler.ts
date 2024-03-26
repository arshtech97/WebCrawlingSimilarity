import * as puppeteer from "puppeteer";

function removeNonAlphanumeric(input: any) {
    return input.replace(/[^a-zA-Z0-9\s]/g, '');
}

// In Future can extend this to crawl every page in the website heirarchy for now it crawls on a single page
async function crawlWebsite(websiteUrl: any){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(websiteUrl);
    const textContent = await page.$eval('*', (el) => {
        console.log("Element: ", el)
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNode(el);
        selection?.removeAllRanges();
        selection?.addRange(range);
        return window.getSelection()?.toString()
    });
    websiteUrl = websiteUrl.split(".com")[0] + ".com"
    console.log(textContent);
    // Sanitize the data
    // 1. Remove the empty strings, trim the strings.
    let result = textContent?.split("\n").filter(str => str.trim() !== "").map(str => str.trim()).map(str => removeNonAlphanumeric(str));
    browser.close();
    return result?.map(str => ({"website": websiteUrl, "data": str}));
}

export {crawlWebsite}