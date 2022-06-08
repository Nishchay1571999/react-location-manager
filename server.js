const express = require('express');
const fileUpload = require('express-fileupload');

const app = express();

app.use(fileUpload());

// Upload Endpoint
app.post('/upload', (req, res) => {
  if(req.body === null){
    return res.status(400).json({ msg: 'No data uploaded' });
  }
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }

  const file = req.files.file;
  const location = req.body.data;
  const link = req.body.link;
  const description = req.body.description;
  const email = req.body.email;
  const emailbody = req.body.emailbody
  // formData.append("description",editorState1);
  // formData.append("email",email);
  // formData.append("emailbody",editorState2);

  file.mv(`${__dirname}/client/public/uploads/${file.name}`, err => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    const resp ={ 
      fileName: file.name,
      filePath: `/uploads/${file.name}`,
      locations: location,
      links:link,
      descr:description,
      em:email,
      embody:emailbody
    }
    
    res.json(resp);
  });
});

app.listen(5000, () => console.log('Server Started...'));

const completedata= [];