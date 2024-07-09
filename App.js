import React, { useState, useEffect } from 'react';
import './App.css';
import Post from "./Post";
import { db, auth } from './firebase';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { Input } from '@mui/material';
import ImageUploader from './ImageUploader';

// set the basic style of the app
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


function App() {
  // state used to open a variable
  const handleOpen = () => setOpen(true);
  // state used to close/hide a variable
  const handleClose = () => setOpen(false);
  // store posts in empty array
  const [posts, setPosts] = useState([]);
  // controlls visability of button
  const [open, setOpen] = useState(false);
  // controlls visability specifically for "sign in" button
  const [openSignIn, setOpenSignIn] = useState(false);
  // sets username to be stored as a string
  const [username, setUsername] = useState('');
  // sets email to be stored as a string
  const [email, setEmail] = useState('');
  // sets password to be stored as a string
  const [password, setPassword] = useState('');
  // stores current user's account information
  const [user, setUser] = useState(null);


  useEffect(() => {
    // keeps user logged in
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user logged in
        console.log(authUser);
        setUser(authUser);
      } else {
        // user logged out
        setUser(null);
      }
    })

    return () => {
      // perform some cleanup actions
      unsubscribe();
    }
  }, [user, username]);

  useEffect(() => {
    // every time a new post is added, it gets added to the "posts" section in firebase
    db.collection('posts').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, []);

  // object to allow for signing up/authentication
  const signUp = (eventt) => {
    eventt.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error) => alert(error.message));

    setOpen(false);
  }

  // object to allow a user to sign in
  const signIn = (eventt) => {
    eventt.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))

    setOpenSignIn(false);
  }

  /* contains: 
  * buttons for sign up, sign in, and logout
  * instagram logo
  * sets up variables needed for a post
  * button for image uploading 
  */
  return (
    <div className="app">
      
      <Modal
        open={open}
        onClose={handleClose}

      >
        <Box sx={style}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://pnghq.com/wp-content/uploads/pnghq.com-instagram-logo-splatter-p-7.png"
                alt=""
              />
            </center>
            <Input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              type="text"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="text"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>Sign Up</Button>
          </form>
        </Box>
      </Modal>

      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://pnghq.com/wp-content/uploads/pnghq.com-instagram-logo-splatter-p-7.png"
          alt=""
        />
        {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ) : (
          <div className="app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </div>

      <div className="app__posts"> 

      </div>
      {
        posts.map(({ id, post }) => (
          <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageURL={post.imageURL} />
        ))
      }
      <div>

        <Modal
          open={openSignIn}
          onClose={() => setOpenSignIn(false)}

        >
          <Box sx={style}>
            <form className="app__signup">
              <center>
                <img
                  className="app__headerImage"
                  src="https://pnghq.com/wp-content/uploads/pnghq.com-instagram-logo-splatter-p-7.png"
                  alt=""
                />
              </center>
              <Input
                type="text"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="text"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" onClick={signIn}>Sign In</Button>
            </form>
          </Box>
        </Modal>
      </div>

      {user?.displayName ? (
        <ImageUploader username={user.displayName} />
      ) : (
        <h3>Sorry, you need to login to upload</h3>
      )}

    </div>
  );
}

export default App;
