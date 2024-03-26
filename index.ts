import { client } from "./weaviateClient/Client";
import { addSchema, deleteSchema } from "./weaviateClient/Schema/CrawledData";
import { runQuery } from "./weaviateClient/Query/query";
import { loadData } from "./weaviateClient/Index/indexVectorDB";
import { crawlWebsite } from "./webCrawler";



// Ideally these functions should be hosted on a server and different functions should be exposed as a different APIs.
async function main(): Promise<void>{
    const websiteName = "https://quotes.toscrape.com/"; // Input 1 Website Name 

    //Call crawler here and push the data to loadData
    //This crawler can't get by pass captchas and human verification to visit the actual website so use simple website only.
    // This can crawl dynamic elements as well.
    const crawledData = await crawlWebsite(websiteName) 
    
    await addSchema(); // This function should be run once only.
    
    await loadData(crawledData);
    
    let keyword = "scientist" // Input 2 This keyword can be anything you would like to search upon crawled data set max 1 - 2 word.
    
    // This function will print the closest 3 data which webCrawler has indexed for the above website.
    await runQuery(keyword);

}

main();
//deleteSchema()


// Print all the elements in the DB This is for logging purpose
client.schema.
    getter().
    do().
    then(res => {
        console.log(JSON.stringify(res));
    }).
    catch(err => {
        console.log(err);
    });