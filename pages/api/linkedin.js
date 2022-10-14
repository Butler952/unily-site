import Cors from 'cors'
import fetch from "node-fetch"
import initMiddleware from '../../lib/init-middleware'

// Initialize the cors middleware
const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ['GET', 'POST', 'OPTIONS'],
  })
)

export default async function handler(req, res) {
  // Run cors
  await cors(req, res)

  //return console.log(req.query)

  // Rest of the API logic
 var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer 535f6290-580a-42db-b7cb-93677b8c82e6");
  myHeaders.append("Access-Control-Allow-Origin", "https://www.vitaely.me, https://personal-page-generator-v1.vercel.app, http://localhost:3000/, https://localhost:3000/, https://nubela.co/proxycurl/api/v2/, https://firebasestorage.googleapis.com");
  myHeaders.append('Access-Control-Allow-Credentials', 'true');
  myHeaders.append("Access-Control-Allow-Methods", "GET, OPTIONS");
  myHeaders.append("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

  var requestOptions = {
    mode: 'cors',
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  var strippedUrl = req.query.profileUrl.split("https://www.linkedin.com/in/").pop()

  fetch("https://nubela.co/proxycurl/api/v2/linkedin?url=https%3A%2F%2Fwww.linkedin.com%2Fin%2F" + strippedUrl, requestOptions)
    .then(response => response.json())
    .then(data => res.send(data))
}