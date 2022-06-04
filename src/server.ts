import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles, validateImageUrl} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/filteredimage", async ( req, res ) => {
    const imageUrl = req.query.image_url;
    if(validateImageUrl(imageUrl)) {
      console.log("image from url: " + imageUrl)
      filterImageFromURL(imageUrl).then(filteredpath => {
        console.log("filteredpath: " + filteredpath)
        res.sendFile(filteredpath, function (err) {
          deleteLocalFiles([filteredpath])
        })
      })
    } else {
      res.status(400).json({status: 400, message: "imageUrl is not valid"})
    }
  }); 

  app.get( "/", async ( req, res ) => {
      res.send("health check")
  });

  
  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();