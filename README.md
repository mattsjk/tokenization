# Coding Exercise #

### Purpose ###

A simple tokenization service in NodeJs.

The purpose of tokenization is to swap out sensitive data, typically payment card or bank account numbers, with a randomized string with no intrinsic value of its own. The service providea two HTTP endpoints, which will tokenize a collection of account numbers and another one to swap back the tokens for the original account numbers.

Tokenization is the process of replacing actual sensitive data elements with non-sensitive data elements that have no exploitable value for data security purposes. De-tokenization returns the original data element for a provided token. Applications may require access to the original data, or an element of the original data, for decisions, analysis, or personalized messaging.

Tokenization solutions are mainly meant to minimize distribution of sensitive data, reduce risk of exposure, improve security posture, and alleviate compliance obligations. Encryption rarely results in cipher text with a similar format to the original data, and may prevent data analysis, or require consuming applications to adapt. Although scope reduction, data analytics, threat mitigation, and data masking for the protection of sensitive data make very powerful arguments for tokenization, we acknowledge there may be instances where encryption is the more appropriate solution (Ex: Scalability, Data Format, Data sharing with 3rd parties).

Throughput, latency, deployment architecture, resiliency, batch capability and multi-regional support can impact the tokenization solution of choice.

### Getting started ###

- Install NodeJS (latest LTS v18.12.1) (NPM comes with the NodeJS, but update to latest version v9.1.1)

** Node Modules used: **
- Express: npm install -g express --save
- body-parser − For handling JSON, Raw, Text and URL encoded form data: npm install body-parser --save
- LokiJS - The super fast in-memory javascript document oriented database: npm install lokijs --save
- SuperTest - Super-agent driven library for testing node.js HTTP servers using a fluent API: npm install supertest --save-dev
- mocha: npm install mocha --save-dev

** Assumptions: **
- The http request body data type: "text/plain"
- The http request body size limit: 100 KB

** Test framework: **
- Mocha with SuperTest

### Running the application ###
```
npm start
OR
node app.js
```

The application runs on port 3000 by default. To access the application, use http://localhost:3000

** Endpoints with sample payloads: **

POST http://localhost:3000/tokenize
	Content-Type: text/plain
	Body Content: ['4999-8978-9010-7765', '3890-9012-7261-8918', '6726-9011-6651-9102']
	
	Returns the token/s
	
POST http://localhost:3000/detokenize
	Content-Type: text/plain
	Body Content: ['adced7c7-70cd-46ba-9e0a-4df9effebb57','f2fae66b-1606-4291-b5a5-948d8177e4f7,'06f93641-0546-4218-b7a5-acc3efdcd998']
	
	Returns the account number/s

### Running tests ###
```
npm test
```
- Improvements: Need to find a better way to execute the tests and shutdown the service after tests are completed
