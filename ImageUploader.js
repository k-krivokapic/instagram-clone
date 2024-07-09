import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { storage, db } from './firebase';
import firebase from 'firebase/compat/app';
import './ImageUploader.css';


function ImageUploader({ username }) {
  // state used to hold image file
  const [image, setImage] = useState(null);
  // state used keep track of file upload progress
  const [progress, setProgress] = useState(0);
  // sets caption to be stored as a string
  const [caption, setCaption] = useState('');
  // checks for a file and updates image to be that file
  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  // handles everything related to uploading
  const handleUpload = () => {
    // uploads image to firebase
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // progress function
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        // error function
        console.log(error);
        alert(error.message);
      },
      () => {
        // image upload is complete, store in firebase
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            // post the image inside db
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageURL: url,
              username: username
            });
            // reset progress
            setProgress(0);
            setCaption("");
            setImage(null);
          });
      }
    );
  };
  // text box for caption and button to upload
  return (
    <div className="imageupload">
      <progress className="imageupload__progress" value={progress} max="100" />
      <input type="text" placeholder='Enter a caption...' onChange={eventt => setCaption(eventt.target.value)} value={caption} />
      <input type="file" onChange={handleChange} />
      <Button onClick={handleUpload}>
        Upload
      </Button>
    </div>
  )
}

export default ImageUploader
