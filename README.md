# dns-manager-backend
Backend for DNS manager

Purpose: Develop a web application to provide a central dashboard for automating management of domains and DNS records in bulk on AWS Route 53. 



•⁠  ⁠Standardizing on MERN stack for frontend, backend and infrastructure layers while keeping the modular design.
  - Ensure access to AWS Route 53. 


 - Establish backend API endpoints connecting the UI to the DNS system on AWS Route 53.
  - Implement API calls for CRUD operations on DNS records.

# API Routes

**[View API Routes Doc](./doc/README.md)**

Resource: 

https://aws.amazon.com/route53/ 


## Installation

You can run this app for testing and devlopment by running the following in your terminal

Make sure you have Nodejs install and version above v18.17.0

```bash
git clone https://github.com/ptech12/dns-manager-backend
```

change to project directory and install dependencies

```bash
cd dns-manager-backend && npm install
```


Create the Environment Variable file and update the contents

```bash
touch .env
```

Open the .env in a editor and add the backend-server URL
```bash
NODE_ENV="dev"
JWT_SECRET=
JWT_SECRET_EXPIRATION="1d"
DATABASE_URL=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
```


Start the server 
```bash
npm run dev
```

