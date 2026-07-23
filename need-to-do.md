Option 3: Back-End API Development Challenge  
Objective 
Design and develop a RESTful API for a Customer Management System. The application 
should support complete CRUD (Create, Read, Update, Delete) operations and follow 
REST API best practices. 
You may use any programming language, framework, database, and AI-assisted 
development tools. However, solutions developed using Microsoft .NET (preferably 
ASP.NET Core Web API) with a relational database such as Microsoft SQL Server are 
preferred. Regardless of the technologies or AI tools used, you must fully understand 
your implementation and be able to clearly explain the architecture, design decisions, 
and every major component of the solution during the interview. 
Functional Requirements 
Develop REST APIs to manage customer information. Each customer shall contain the 
following fields: 
o Customer ID (Auto-generated) 
o Customer Name 
o Email Address 
o Mobile Number (multiple: primary, alternate, etc.) 
o Date of Birth 
o National ID Number 
o Address (multiple: present address, permanent address, mailing address etc.) 
o Created Date 
o Last Updated Date 
o Documents: NID, Tax Certificate, Photo, Signature etc. 
Required APIs 
o Create Customer: Creates a new customer. 
o Get Customer by ID: Returns a specific customer. 
o Get All Customers:  
Support: 
 Pagination 
 Sorting 
 Search by Name 
 Filter by Status 
o Update Customer: Updates an existing customer. 
o Delete Customer: Deletes a customer. 
Validation Rules 
You should validate: 
o Customer Name is mandatory. 
o Email must be unique and in a valid format. 
o Mobile Number must be unique. 
o National ID Number must be unique. 
o Date of Birth cannot be a future date. 
o Appropriate HTTP status codes should be returned. 
Error Handling 
Handle scenarios such as: 
o Customer not found 
o Duplicate email/mobile/NID 
o Invalid request payload 
o Internal server errors 
Return meaningful error messages. 
Technical Requirements 
The solution should include: 
o RESTful API 
o Relational or NoSQL database 
o Layered architecture (Controller, Service, Repository) 
o Source code 
o README 
o API documentation (Swagger preferred) 
Docker 
Documentation 
The application must run using Docker. You should provide: 
o Dockerfile 
o Docker image (optional) 
o docker-compose.yml (preferred) 
The evaluator should be able to run the application with minimal configuration. 
Include: 
o Project overview 
o Technology stack 
o Database schema 
o API endpoints 
o Build and run instructions 
o Assumptions 
o AI tools used 
AI Usage 
You may use any AI coding assistant. You should document: 
o AI tool(s) used 
o Sample prompts 
o How AI-generated code was verified 
o Any modifications made to AI-generated code 
Demonstration 
During the interview, you should: 
o Demonstrate all CRUD operations. 
o Explain the API design. 
o Explain the database design. 
o Explain validation and exception handling. 
o Explain how AI assisted during development. 
o Answer technical questions without referring to AI tools. 
