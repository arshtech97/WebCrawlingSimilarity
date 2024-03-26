import { client } from "../Client";

async function loadData(crawledData: any): Promise<void>{
    // Call the crawler method to return the list which is similar to schema of weaviate
    
    // Here will be your Data objects which you want to vectorize     
    // const dataItems = [
    //   {
    //     "website": "www.example.com",
    //     "data": "This is example.com."
    //   },
    //   {
    //     "website": "www.wikipedia.org",
    //     "data": "Welcome to Wikipedia."
    //   },
    //   {
    //     "website": "www.amazon.com",
    //     "data": "Discover great deals on Amazon."
    //   },
    //   {
    //     "website": "www.twitter.com",
    //     "data": "What's happening?"
    //   },
    //   {
    //     "website": "www.netflix.com",
    //     "data": "Watch your favorite shows on Netflix."
    //   }
    // ]
    const dataItems = crawledData

    let batcher = client.batch.objectsBatcher();
    let counter = 0;
    const batchSize = 100;

    for (const q of dataItems){
        const obj = {
            class: 'CrawledData',
            properties:{
                website: q.website,
                data: q.data
            }
        };
        batcher.withObject(obj);
        counter++;
        if (counter == batchSize){
            // Flush the batch queue
            const res = await batcher.do();
            console.log(res);

            // Restart the batch queue
            counter = 0;
            batcher = client.batch.objectsBatcher();
        }
    }
    const res = await batcher.do();
    console.log("Logging results after doing batch: " ,res);
    console.log('Logging res[0]: ', res[0])
    const errs = res[0].result?.errors
    console.log(errs);

}

export {loadData}