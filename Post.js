import React, { useEffect, useState } from 'react'
import './Post.css'
import { Avatar } from '@mui/material'
import { db } from './firebase';
import { Timestamp } from 'firebase/firestore';
import firebase from 'firebase/compat/app';

function Post({ postId, user, username, caption, imageURL }) {
  // sets comments to be stored in an array
  const [comments, setComments] = useState([]);
  // stores user comment as a string
  const [comment, setComment] = useState('');
  // calls firebase to store comment for specific post in database
  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }

    return () => {
      // cleanup process
      unsubscribe();
    };

  }, [postId]);
  // retrieves data for storing comment in firebase
  const postComment = (eventt) => {
    eventt.preventDefault();

    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    setComment('');
  }
  /* contains:
  * post header, user avatar, image, caption, and comments
  * sets up button and textbox for users to write and upload comments
  */
  return (
    <div className="post">
      <div className="post__header">
        <Avatar
          className="post__avatar"
          alt=""
          src="https://upload.wikimedia.org/wikipedia/commons/a/a3/June_odd-eyed-cat.jp"
        />
        <h3>{username}</h3>
      </div>

      <img className="post__image" src={imageURL} />

      <h4 className="post__text"> <strong>{username}</strong> {caption}</h4>

      <div className="post__comments">
        {comments.map((comment) => (
          <p>
            <strong>{comment.username}</strong> {comment.text}
          </p>
        ))}
      </div>

      {user && (
        <form className="post__commentBox">
          <input
            className="post__input"
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className="post__button"
            disabled={!comment}
            type="submit"
            onClick={postComment}
          >
            Post
          </button>
        </form>
      )}


    </div>
  )
}

export default Post
