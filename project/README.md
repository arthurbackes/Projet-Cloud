# :books: LINFO2145 Project: Scalable Shopping-cart Application

**LINFO2145 Autumn, 2026** -- *Etienne Rivière, Yinan Cao, Paul-Edouard Bertrand Van Ouytsel, Rémi Van Boxem, and Clément Delzotti*

The LINFO2145 project will last for most of the quadrimester, and is structured in a single deliverable for **23rd of November 2026**

In this project, you'll learn how to build elastically scalable backend services and deploy them on an emulated distributed system on your machine and then on Microsoft Azure.

The description of the project on this page focuses on the general objectives and requirements.
You should first read this document carefully.
Then, you can proceed to the practical bootstrap tutorials (links are provided at the end of this document).

## Your mission

Your team of two developers has been tasked with the design and implementation of the *backend* of a shopping-cart application (**SCApp** for short).
SCApp allows users to browse for items.
Once a user is logged in, he or she can add items to a shopping cart, and eventually checkout and buy the products.

The front-end development team already built a reactive Web interface using a modern framework, [Svelte](https://svelte.dev/).
This front-end prototype is already functional: it allows browsing through a set of objects, and it emulates the cart and checkout functionalities.
However, this prototype only uses local storage: the set of items in the shop (including their characteristics, their photo, etc.) and the state associated with the user session (the content of the cart, etc.) are downloaded as static content, or maintained as a local state in the client browser.

Obviously, this is not how this application should work in practice: the list of items, their characteristics, availability, their photo etc. must be obtained dynamically from a remote back end service running in the Cloud.
Information about the user activity, such as her/his shopping cart content, must also be maintained and kept in the Cloud.
This is where your role starts.

Starting from the provided front-end, you will build a series of microservices running in the Cloud and supporting the *back-end* of the application.
In the following, you will find the requirements that the management team has set up for the application.

## Functional requirements

SCApp recognizes three user roles:

- **Non-authenticated users** browse and see items, but they cannot add anything to their cart;
- **Authenticated users** can use all non-privileged application functionality;
- **Administrators** have the possibility to change the information about existing items and to add new items to the catalogue.

The first service you will need to build is therefore an *authentication service*.
Actually, this step is the focus of the [second bootstrap tutorial](practicals/02_ProjectSetup_AuthenticationService.md) where we will show how to build and run the service using [node.js](https://nodejs.org/en/) in a container.
Later, we will see how to host and run this container in a VM in Azure.
The tutorial also details how to connect the front-end to the back-end for this service.

The service allows **authenticated users** to perform the following actions.

- Browse through a collection of items, and see a page for each item individually.
- Add/Remove items to/from a shopping cart.
- Perform a purchase (checking out).
- Make purchases persistent. When a user leaves the application and later reconnects (possibly from another browser) the history of purchases must be preserved as well as the content of the cart.

The following functionalities are restricted to *administrators*.

- Use an interface for updating the characteristics of an item (price, description). Ideally, this interface could be a Web interface, but it is accepted that it is only a simple HTML form. A command-line API, or a RESTful API used with the `curl` tool is also acceptable.
- An interface for adding new items to the catalogue, including a new description, and a new photo.

## Technical requirements

The realization of your back-end must respect the following technical conventions:

- It must use a set of microservices offering RESTful APIs over HTTP.
- Each microservice must employ its own database, and this database must be able to scale to handle a (potentially large) number of future clients. In particular, we strongly recommend the use of [CouchDB](http://couchdb.apache.org).
- Each microservice should be implemented using JavaScript by default. For the sake of our evaluation capacity, if you wish to use another language please get our explicit approval first. Any provided code samples will remain in JavaScript and we won't provide any support to adapt these to your specific choices.
- Microservices must be packaged as Docker containers, and use Docker networking to connect with their database.
- Every microservice must be properly documented and tested.

The storage of the images of the products must be externalized to [Azure Storage](https://docs.microsoft.com/en-us/azure/storage/).
When a new product is entered using the administrator's interface, the provided image must be uploaded to Azure Storage.

:gift: **Bonus.** The first version of your admin interface can consider that the format of the image provided by the administrator is correct (same height/width, JPEG format, and sufficiently small in size to display fast in the front-end application).
In a second version, you may process, validate and possibly resize/rescale the image before storing it in Azure Storage.
This can be done in a dedicated microservice, or using server-less processing with [Azure Functions](https://azure.microsoft.com/en-us/services/functions/).

### Logging

In order to facilitate debugging and allow processing of user-generated data, you must also provide a *logging microservice*.
Other microservices will asynchronously send logs to this service, which will store them in a CouchDB database as JSON objects.

:pencil: **Note.** For this service, **we impose the use of CouchDB** as it will be necessary for the Map/Reduce recommendation engine later in the project.
You remain free to use other databases for your other microservices.

The logging service must log the following information:

- User actions, such as viewing an item, adding an item to the cart, buying an item, etc.
- Performance measurements, such as the time spent for answering a call by each microservice, the nature of the call, and the role of the client.
- Any other information you think can have an interest for the marketing department and for performance insights for the deployment team.

#### Elastic scaling

The load that each microservice will support over time can change, depending on the number of active users.
We therefore want to be able to add and remove instances of each microservice dynamically, a property known as *elastic scaling*.

Each of your microservices will be formed of a pair: a stateless service implementation in node.js and a database.
The database and the service implementation must be able to scale independently.
For instance, the authentication service may decide to add a node to the database it uses (CouchDB) while keeping the number of service instances the same, or reversely use more service instances while keeping the database as it is.


### Recommendation system

Based on the data you logged, you must build a recommendation system that will allow users to receive personalized recommendations based on their purchases and behaviour on the website (e.g., which items did they look at, etc). You must leverage Map/Reduce to build this recommendation engine.

## Auto-assessment

To ensure your capacity to understand your deliverable, you'll have to complete the [AUTO-ASSESSMENT.md](AUTO-ASSESSMENT.md) grid. It will be used during the oral examination to discuss the weaknesses and strengths of your project.

## Oral examination

At the end of the semester, during the last two weeks of the regular courses period, you'll present your project as groups during individual sessions with the teaching staff. During this session, you'll have to pull and deploy your project and answer questions regarding architecture choices, your code and your self-assessment of the project.

## Deliverable

Your deliverable should target the deployment team (as well as the front end team), who should be able to set up and run your entire back-end on Azure using an account different than your own.

This will take the form of a private GitHub repository that the deployment and front-end teams will be able to access (in your case, LINFO2145 instructors).
This repository is initialized as a **private fork** of the LINFO2145 2026-2027 repository.

The version that will be considered is the one available at the deadline (announced in class and on Moodle).
You will announce the availability of your deliverable by filling in an assignment on Moodle with the name of your repository and the confirmation that you have invited all teaching assistants to access it.

Your deliverable must include:

- The code in node.js for each microservice, the Docker configuration files and any script allowing its easy deployment;
- Instructions on the necessary Azure setup (or even better, a script performing those automatically);
- Each microservice must be described in the README.md file of its source folder, including its role, limitations, and its complete API specification.
- A two-page short PDF report describing your architecture and any technical choices you may have made, under the `Project` directory.

:pencil: **Note.** Feel free to send us a *pull request* with suggested changes.
Meaningful updates to the course GitHub repositories can be taken into account as a bonus when grading your project.

## Bootstrap tutorials

The following bootstrap tutorials should be your starting points for working on the project:

1. The [bootstrap tutorial](practicals/README.md) gives pointers to useful documentation and details what should be installed on your development machine;
1. The [front end tutorial](practicals/01_ProjectSetup_FrontEnd.md) details how to run the provided front end for the application.
1. The [authentication microservice tutorial](practicals/02_ProjectSetup_AuthenticationService.md) shows how to run a first microservice for the backend of the application and to connect this microservice from the frontend.

As the project advances, we will provide new tutorials for employing techniques and solutions seen in class.
You should start by deploying and running your project on your local mini-cloud (as we have done during tutorials 1 and 2).
We will later provide information on how to access and deploy the back end on Microsoft Azure and Map/Reduce.
