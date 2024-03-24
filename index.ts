import weaviate, { WeaviateClient, ApiKey } from 'weaviate-ts-client';

  const client: WeaviateClient = weaviate.client({
    scheme: 'http',
    host: 'localhost:8080',//'testing-vectordb-c1go65b0.weaviate.network',
    headers: { 'X-Cohere-Api-Key': 'kU7o4Fif6mNsFpiSzsr5YpN08Jhy7f6fPYLfrwGI', 'X-HuggingFace-Api-Key': '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' }
  });

  /*
    Sometimes hugging face API fails as it does a cold start and gives out 503 error
  */
  const classObj = {
    'class': 'Question',
    // Note if you are starting the project for the first time this might break and cause issues.
    'vectorizer': 'text2vec-huggingface',
    properties: [
        {
            name: "question",
            dataType: ["text"]
        },
        {
            name: "answer",
            dataType: ["text"]
        },
        {
            name: "category",
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
  }

  async function addSchema(): Promise<void> {
    // If Schema already exsits do nothing and return 
    let schemaExists = await client.schema.exists('Question'); // Make the schema configurable
    
    if (schemaExists == true){
        console.log("Schema already Exists so skipping the schema creation part.")
        return;
    }

    // Otherwise create the schema 
    const res = await client
                        .schema
                        .classCreator()
                        .withClass(classObj)
                        .do();
    // Make adding schema configurable
    console.log("Adding Schema: Question")
    console.log(res);

    await loadData();
  }

  async function deleteSchema(): Promise<void> {
    const res = await client
                        .schema
                        .classDeleter()
                        .withClassName('Question')
                        .do();
    console.log("Deleting Schema: Question")
    console.log(res);
  }
  
  async function loadData(): Promise<void>{
        // Here will be your Data objects which you want to vectorize     
        const dataItems = [
            {
              "Category": "SCIENCE",
              "Question": "This organ removes excess glucose from the blood & stores it as glycogen",
              "Answer": "Liver"
            },
            {
              "Category": "ANIMALS",
              "Question": "It's the only living mammal in the order Proboseidea",
              "Answer": "Elephant"
            },
            {
              "Category": "ANIMALS",
              "Question": "The gavial looks very much like a crocodile except for this bodily feature",
              "Answer": "the nose or snout"
            },
            {
              "Category": "ANIMALS",
              "Question": "Weighing around a ton, the eland is the largest species of this animal in Africa",
              "Answer": "Antelope"
            },
            {
              "Category": "ANIMALS",
              "Question": "Heaviest of all poisonous snakes is this North American rattlesnake",
              "Answer": "the diamondback rattler"
            },
            {
              "Category": "SCIENCE",
              "Question": "2000 news: the Gunnison sage grouse isn't just another northern sage grouse, but a new one of this classification",
              "Answer": "species"
            },
            {
              "Category": "SCIENCE",
              "Question": "A metal that is ductile can be pulled into this while cold & under pressure",
              "Answer": "wire"
            },
            {
              "Category": "SCIENCE",
              "Question": "In 1953 Watson & Crick built a model of the molecular structure of this, the gene-carrying substance",
              "Answer": "DNA"
            },
            {
              "Category": "SCIENCE",
              "Question": "Changes in the tropospheric layer of this are what gives us weather",
              "Answer": "the atmosphere"
            },
            {
              "Category": "SCIENCE",
              "Question": "In 70-degree air, a plane traveling at about 1,130 feet per second breaks it",
              "Answer": "Sound barrier"
            }
          ]
        let batcher = client.batch.objectsBatcher();
        let counter = 0;
        const batchSize = 100;

        for (const q of dataItems){
            const obj = {
                class: 'Question',
                properties:{
                    category: q.Category,
                    question: q.Question,
                    answer: q.Answer
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

  async function runQuery(): Promise<void> {
        const result = await client.graphql
                                    .get()
                                    .withClassName('Question')
                                    .withFields('question answer category') // Only these columns will be returned
                                    .withNearText({concepts: ['airplane']}) // User Prompt Goes here
                                    //.withGenerate({singlePrompt: 'Explain breifly about {question}.'}) // You can plug the value returned withNearText functionality this prompt 
                                    .withLimit(3)
                                    .do();
        console.log("Results: ", result.data.Get.Question);
  }

  async function main(): Promise<void>{
        await addSchema(); // This function should be run once only.
        await runQuery();
  }

  main();
  //deleteSchema();

  client.schema.
        getter().
        do().
        then(res => {
            console.log(JSON.stringify(res));
        }).
        catch(err => {
            console.log(err);
        });