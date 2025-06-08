Getting started with development:
1. [Local](#developing-locally)
2. [Codespaces](#developing-in-github-codespaces)
3. [Running the web app](#running-the-application)


## Living Specifications Document
[CyberPipeline Specifications Document.pdf](https://github.com/user-attachments/files/18552079/CyberPipeline.Specifications.Document.pdf)


## Developing Locally

This repository is set up as a [devcontainer](https://code.visualstudio.com/docs/devcontainers/containers). It includes some custom setup for my own infrastructure that is commented out.

See `.devcontainer/docker-compose.yml` to enable Traefik routing. 

Upon cloning the repository, copy `.env-local.example` to `server/.env` and customize as needed.  


## Developing in Github Codespaces

1. Copy code FROM `.env.example` TO `server/.env`
2. [OPTIONAL] Copy your Canvas token into the `.env`
3. [OPTIONAL] Set `CANVAS_ENABLED` to true
4. Press `ctrl+shift+p`, find `Tasks: Run Task`, and run the `Watch All` task
5. Go to the `Ports` tab and `ctrl+click` on the port 3001 codespace URL
6. Navigate to the newly opened site and append either of the following URLs
- Student View: `/auth/login?eid=test-student`
- Admin View: `/auth/login?eid=test-admin`


## Running the application:

There are VSCode Tasks set up to launch the client and server together. CTRL + SHIFT + P and then look for Run Tasks and choose Watch All.


## Updating the seed file:

If any changes are made to the seed file found in "server > seeds > initial_data.js", you will need to re-seed the Knex Db through the following steps:
1. cd server
2. knex seed:run  

If 'knex' is an unknown command, simply install it globally through the node command 'npm install knex -g' and re-do Step 2.

## Testing

To test the program, follow these steps:
1. Press `ctrl+shift+p`
2. Find `Tasks: Run Task`
3. Run the `Test Client` task to test the client
4. Run the `Test Server` task to test the server
5. Run the `Test All` task to run all tests

