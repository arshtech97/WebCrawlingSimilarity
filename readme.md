# Project Title

This project does webscraping for a given website and leverages vectorDB like weaviate to support client queries for closest word present in dataSet. This project is built like a Proof Of Concept style instead it should be hosted on a server and APIs need to be exposed. (Future Enhancements)

## Table of Contents

- Installation
- Configurations

## Installation

 
- Dependencies:
    1. Node version: v18.10.0
    2. Docker Desktop
    3. puppeteer - Project Dependency
    4. weaviate-ts-client - Project Dependency
    
- Installation steps:
    0. Clone the project into your system. 
    1. Install Node into system: 
        - brew install node@18.10.0
    2. Install all the dependencies of the project:
        - npm install   
    3. Make sure you Have Docker Installed:
        - https://www.docker.com/products/docker-desktop/ 
    4. Go to the project folder and run "docker compose up -d" to create a container which will be running weaviate server.
    5. Set your 2 inputs in the index.ts file, 1. websiteName(String), 2. keyword(String)
    6. Run the project using "npm start"

## High Level Diagram
![HLD](https://github.com/arshtech97/WebCrawlingSimilarity/blob/highlevel/HighLevelDesign.png?raw=true)



## Configurations
- Here two 3rd Party APIs are being used:
    - huggingface(for inference model which helps in deciding vector weights for a given text/query)
    - weaviateClinet(for querying vectorDB weaviate and indexing data with vector weights we got from hugging face)
    - Since we are using the free model huge data vectorization from huggingface will caluse rate limit error.
    - Apart from this we can leverage Cohere LLM to create generative data for the user query on our crawled dataSet as well.