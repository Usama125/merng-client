import React, { useContext } from 'react';
import { Card, Icon, Label, Image, Button } from 'semantic-ui-react';
import moment from 'moment';
import { Link } from 'react-router-dom';

import { AuthContext } from '../context/auth';
import LikeButtonComponent from './LikeButtonComponent';
import DeleteButtonComponent from './DeleteButtonComponent';

function PostCard({post: { body, createdAt, id, username, commentCount, likeCount ,likes }}){
   

    const { user } = useContext(AuthContext);
    
    const likePost = () => {
        alert('Like Post');
    }

    return (
    <Card fluid>
      <Card.Content>
        <Image
          floated='right'
          size='mini'
          src='https://react.semantic-ui.com/images/avatar/large/steve.jpg'
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={'/posts/${id}'}>{ moment(createdAt).fromNow() } </Card.Meta>
        <Card.Description>
          {body}
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
         <LikeButtonComponent user={user} post={{id, likes, likeCount}} />
         <Button
            basic
            color='blue'
            as={Link}
            to={`/posts/${id}`}
            size="mini"
            content='Comments'
            icon='comments'
            label={{
                as: 'a',
                basic: true,
                color: 'blue',
                pointing: 'left',
                content: commentCount,
            }}
            />
            {user && user.username === username && (
              <DeleteButtonComponent postId={id} />
            )}
      </Card.Content>
    </Card>
   )
}

export default PostCard;