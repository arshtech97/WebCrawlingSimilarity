import { client } from "../Client";

async function runQuery(keyword: any): Promise<void> {
    const result = await client.graphql
                                .get()
                                .withClassName('CrawledData')
                                .withFields('website data') // Only these columns will be returned
                                .withNearText({concepts: [keyword]}) // User Prompt Goes here
                                //.withGenerate({singlePrompt: 'Explain breifly about {question}.'}) // You can plug the value returned withNearText functionality this prompt 
                                .withLimit(3)
                                .do();
    console.log("Results: ", JSON.stringify(result.data.Get.CrawledData));
    let res = result.data.Get.CrawledData.map((obj: { data: any; }) => obj.data)
    console.log(res)
}

export {runQuery}