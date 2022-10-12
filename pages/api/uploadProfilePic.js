import fire from '../../config/fire-config';

import storage from '../../config/fire-config';
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
  myHeaders.append("Access-Control-Allow-Origin", "https://www.vitaely.me, https://personal-page-generator-v1.vercel.app, http://localhost:3000/, https://localhost:3000/, https://nubela.co/proxycurl/api/v2/");
  myHeaders.append('Access-Control-Allow-Credentials', 'true');
  myHeaders.append("Access-Control-Allow-Methods", "GET, OPTIONS");
  myHeaders.append("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

  var requestOptions = {
    mode: 'cors',
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  let user = req.query.user
  let fileBlob = req.query.blob

  let filename = "images/" + user + "/profile_picture.jpg"

  var metadata = {
    contentType: 'image/jpeg',
    name: filename,
  };

  var uploadTask = storage.ref().child(filename).put(fileBlob, metadata);

  uploadTask.on('state_changed', 
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case fire.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case fire.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
      }, 
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
          case 'storage/canceled':
            // User canceled the upload
            toast("Upload cancelled")
            break;
    
          // ...
    
          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      }, 
      () => {
        uploadTask.snapshot.ref.getDownloadURL()
          .then(downloadURL => downloadURL.json())
          .then(data => res.send(data))
          .catch((error) => {
            console.log(error);
          });
        }
    );
  }