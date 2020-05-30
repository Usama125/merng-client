import React, { useContext, useState } from 'react'
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Grid, Image, Card, Form, Icon, Button, Label } from 'semantic-ui-react';
import moment from 'moment';
import { AuthContext } from '../context/auth';

import LikeButtonComponent from '../components/LikeButtonComponent';
import DeleteButtonComponent from '../components/DeleteButtonComponent';

function SinglePost(props) {
    const postId = props.match.params.postId;

    const { user } = useContext(AuthContext);
    const [comment, setComment] = useState('');

    const { data } = useQuery(FETCH_POST_QUERY, {
        variables: {
            postId
        }
    });
    
    const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
        update(){
            setComment('');
        },
        variables: {
            postId,
            body: comment
        }
    })

    const deletePostCallback = () => {
        props.history.push('/');
    }

    let postMarkup;

    if(data === undefined){
        postMarkup = <p>Loading Post</p>
    }else {
        const { id , body, createdAt, username, comments, likes, likeCount, commentCount } = data.getPost;
        postMarkup = (
            <Grid.Row>
                <Grid.Column>
                    <Image
                        src="https://react.semantic-ui.com/images/avatar/large/steve.jpg"
                        size="small"
                        float="right"
                    />
                    <Card fluid>
                        <Card.Content>
                            <Card.Header>
                                {username}
                            </Card.Header>
                            <Card.Meta>
                                {moment(createdAt).fromNow()}
                            </Card.Meta>
                            <Card.Description>
                                {body}
                            </Card.Description>
                        </Card.Content>
                        <hr/>
                        <Card.Content extra>
                            <LikeButtonComponent user={user} post={{ id, likeCount, likes }}/>
                            <Button 
                                as="div"
                                labelPosition="right"
                                onClick={() => console.log('Comment On Post')}>
                                
                                <Button basic color="blue">
                                    <Icon name="comments"/>
                                </Button>
                                <Label basic color="blue" pointing="left">
                                    {commentCount}
                                </Label>
                            </Button>
                            {user && user.username === username && (
                                <DeleteButtonComponent postId={id} callback={deletePostCallback}/>
                            )}
                        </Card.Content>
                    </Card>

                    {user && (
                        <Card fluid>
                            <Card.Content>
                                <p>Post a comment</p>
                                <Form>
                                    <div className="ui action input fluid">
                                        <input
                                            type="text"
                                            placeholder="Comment..."
                                            name="comment"
                                            value={comment}
                                            onChange={event => setComment(event.target.value)}
                                        />
                                        <button type="submit" className="ui button teal" disabled={!comment.trim()}
                                            onClick={submitComment}
                                        >Submit</button>
                                    </div>
                                </Form>
                            </Card.Content>
                        </Card>
                    )}

                    { comments.map(comment => (
                        <Card fluid key={comment.id}>
                            <Card.Content>
                                { user && user.username === comment.username && (
                                    <DeleteButtonComponent postId={id} commentId={comment.id}/>
                                )}
                                <Card.Header>
                                    {comment.username}
                                </Card.Header>
                                <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                                <Card.Description>{comment.body}</Card.Description>
                            </Card.Content>
                        </Card>
                    )) }
                </Grid.Column>
            </Grid.Row>
        )
    }
    return postMarkup;    
}

const FETCH_POST_QUERY = gql`
    query($postId: ID!){
        getPost(postId: $postId){
            id body createdAt username
            likeCount
            likes{
                username
            }
            commentCount
            comments{
                id username createdAt body
            }
        }
    }
`

const SUBMIT_COMMENT_MUTATION = gql`
    mutation($postId: ID!, $body: String!){
        createComment(postId: $postId, body: $body){
            id
            comments{
                id body createdAt username
            }
            commentCount
        }
    }
`

export default SinglePost
