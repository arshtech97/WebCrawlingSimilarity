
import { client } from "../Client";

/*
    Sometimes hugging face API fails as it does a cold start and gives out 503 error
  */
    const classSchema = {
        'class': 'CrawledData',
        // Note if you are starting the project for the first time this might break and cause issues.
        'vectorizer': 'text2vec-huggingface',
        properties: [
            {
                name: "website",
                dataType: ["text"]
            },
            {
                name: "data",
                dataType: ["text"]
            }
        ],
        moduleConfig: {
            "text2vec-huggingface": {
                "vectorizeClassName": true
            },
            "generative-cohere": {
    
            }
        }
        // TODO: Load the data from webcrawler to here as well.
      }

      async function addSchema(): Promise<void> {
        // If Schema already exsits do nothing and return 
        let schemaExists = await client.schema.exists('CrawledData'); // Make the schema configurable
        
        if (schemaExists == true){
            console.log("Schema already Exists so skipping the schema creation part.")
            return;
        }
    
        // Otherwise create the schema 
        const res = await client
                            .schema
                            .classCreator()
                            .withClass(classSchema)
                            .do();
        // Make adding schema configurable
        console.log("Adding Schema: CrawledData")
        console.log(res);
      }
    
      async function deleteSchema(): Promise<void> {
        const res = await client
                            .schema
                            .classDeleter()
                            .withClassName('CrawledData')
                            .do();
        
        console.log("Deleting Schema: CrawledData")
      }

      export {classSchema , addSchema, deleteSchema}