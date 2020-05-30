import React, { useState } from 'react'
import { Button, Icon, Confirm } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { FETCH_POST_QUERY } from '../util/graphql';

function DeleteButtonComponent({ postId, callback, commentId }) {

    const [confirmOpen, setConfirmOpen] = useState(false);

    const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

    const [deletePostOrMutation] = useMutation(mutation, {
        update(proxy){
            setConfirmOpen(false);
            if(!commentId){
                const data = proxy.readQuery({
                    query: FETCH_POST_QUERY
                });
                proxy.writeQuery({ query: FETCH_POST_QUERY, data: { getPosts: data.getPosts.filter(post => post.id !== postId) }});
            }
            if(callback) callback();
        },
        variables: {
            postId,
            commentId
        }
    })

    return (
        <>
            <Button
                    as="div"
                    floated="right"
                    size="mini"
                    color="red"
                    onClick={() => setConfirmOpen(true)}>
                    <Icon name="trash" style={{margin: 0}} />
                </Button>
            <Confirm 
                open={confirmOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={deletePostOrMutation}
            />
        </> 
    )
}

const DELETE_POST_MUTATION = gql`
    mutation deletePost($postId: ID!){
        deletePost(postId: $postId)
    }
`

const DELETE_COMMENT_MUTATION = gql`
    mutation deleteComment($postId: ID!, $commentId: ID!){
        deleteComment(postId: $postId, commentId: $commentId){
            id
            comments{
                id username createdAt body
            }
            commentCount
        }
    }
`

export default DeleteButtonComponent
