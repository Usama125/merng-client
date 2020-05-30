import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks';
import { Grid, Row, columns, Transition } from 'semantic-ui-react';
import PostCard from '../components/PostCard';

import PostForm from '../components/PostForm';
import { AuthContext } from '../context/auth';
import { FETCH_POST_QUERY } from '../util/graphql';

function Home() {
    
    const { user } = useContext(AuthContext);

    const { loading, data} = useQuery(FETCH_POST_QUERY);

    return (
        <>
             <Grid columns={3}>
                 <Grid.Row style={{display: 'block', textAlign: 'center'}}>
                     <h1>Recent Posts</h1>
                 </Grid.Row>
                <Grid.Row>
                    {user && (
                        <Grid.Column>
                            <PostForm/>
                        </Grid.Column>
                    )}

                    { loading ? (
                        <h1>Loading Posts</h1>
                    ): (
                        <Transition.Group duration={700}>
                            {
                                data.getPosts && data.getPosts.map(post => (
                                    <Grid.Column key={post.id}>
                                        <PostCard post={post} />
                                    </Grid.Column>
                                ))
                            }
                        </Transition.Group>
                    ) }
                </Grid.Row>
            </Grid>
        </>
    )
}

export default Home
