import swaggerJsdoc from 'swagger-jsdoc'

// https://blog.logrocket.com/documenting-express-js-api-swagger/
const options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'CyberPipeline',
      version: '0.0.1',
      description: 'Application to track Cyber Pipeline Participants',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'K-State Cyber Pipeline',
        url: 'https://alt.cs.ksu.edu/cyber-pipeline/',
        email: 'altcslab@KSUemailProd.onmicrosoft.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./routes/*.js', './routes/api/*.js', './models/*.js'],
}


export default swaggerJsdoc(options)
