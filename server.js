import express from 'express';
import fs from 'fs';
import path, { dirname }from 'path';
import { fileURLToPath } from 'url';
import moment from 'moment';
import archiver from 'archiver';



// Get the current file path
const __filename = fileURLToPath(import.meta.url);

// Get the current directory name
const __dirname = dirname(__filename);


const app = express();
app.use(express.static('public'));




const dirPath = './public/text_files';

//Route to get all textfile names from text_files folder
app.get("/", (req, res) => {
    try {
        fs.readdir(dirPath, (err, files) => {
            if (err) {
                throw err;
            }

            //Filter only text files
            const textFiles = files.filter(file => path.extname(file) === '.txt');
            console.log(textFiles)
           return  res.status(200).json({
                "files": [...textFiles]
            })
        })
        
    } catch (error) {
        return res.status(500).json({
            error: error
        })
    }
});

//Route to add the textfile to the folder
app.get("/createFile", (req, res) => {

    try {
        //Get the current timeStamp
        const timeStamp = new Date();

        const now = moment()
        const formatted = now.format('YYYY-MM-DD-HH-mm-ss')
           

        ///Generate a file name
        const fileName = `${formatted}`;
        console.log(fileName);

        //Generate the file path
        const filePath = path.join(__dirname, `/public/text_files/${fileName}.txt`);
        console.log(filePath);

        //Generate the content of a file
        // Define the content to write into the file
        const content = `Current time is: ${new Date().toString()}`;
        console.log(content)
        fs.writeFile(filePath, content, (err) => {
            if (err) {
                throw err;
            }
            else {
                return res.status(200).json({ "message": "File created successfully" });
            }
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ "Error": error });
    }

});

//Route to get all files in zip format
app.get("/send-zip", (req, res)=>{
   try {
    const folderPath = path.join(__dirname, `/public/text_files/`);
    const zipName = 'folder.zip'; // Output file name in zip
    const output = fs.createWriteStream(zipName); // create a write steam
    const archive = archiver('zip');
     // Pipe the archive data to the output file
     archive.pipe(output);
     fs.readdir(dirPath, (err, files) => {
        if (err) {
            throw err;
        }

        //Filter only text files
        const textFiles = files.filter(file => path.extname(file) === '.txt');
        console.log(textFiles)
        textFiles.forEach(file => {
            const filePath = `${folderPath}/${file}`;
            archive.append(fs.createReadStream(filePath), { name: file });
          });

          // Finalize the archive and wait for the write stream to end
      archive.finalize();
      output.on('close', () => {
        // Download the zip file as a response
        res.attachment(zipName);
        res.sendFile(zipName, { root: __dirname }, (err) => {
          if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
          }
  
          // Delete the zip file after it is downloaded
          fs.unlink(zipName, (err) => {
            if (err) {
              console.error(err);
            }
          });
        });
      });
    })

   } catch (error) {
    
   }
        

    

   

})


export default app;