import React, { useState, useContext } from 'react'
import { Form, Button } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import { AuthContext } from '../context/auth';
import { useForm } from '../util/hooks';

function Login(props) {
    
    const context = useContext(AuthContext);

    const [ errors, setErrors ] = useState({});
    const initialState = {
        username: '',
        password: '',
    }

    function loginUserCallback(){
        loginUser();
    }

    const { onChange, onSubmit, values } = useForm(loginUserCallback, initialState);

    const [loginUser, { loading }] = useMutation(LOGIN_USER, {
        update(proxy, { data: { login: userData } }){
            context.login(userData);
            props.history.push('/');
        },
        variables: values,
        onError(err){
            setErrors(err.graphQLErrors[0].extensions.exception.errors);
        }
    })
 
    return (
        <div style={{width: '400px', margin: 'auto'}}>
            <Form onSubmit={onSubmit} noValidate className={loading ? 'loading': ''}>
                <h1>Login</h1>
                <Form.Input
                    label="Username"
                    placeholder="Username..."
                    name="username"
                    error={errors.username ? true : false}
                    value={values.username}
                    onChange={onChange} 
                />
                <Form.Input
                    label="Password"
                    placeholder="Password..."
                    name="password"
                    error={errors.password ? true : false}
                    type="password"
                    value={values.password}
                    onChange={onChange} 
                />
                <Button type="submit" primary>
                    Login
                </Button>
            </Form>
            {Object.keys(errors).length > 0 && (
                <div className="ui error message">
                    <ul className="list">
                        { Object.values(errors).map(value => (
                            <li key={value}>{value}</li>
                        )) }
                    </ul>
                </div>
            )}
        </div>
    )
}

const LOGIN_USER = gql`
    mutation login(
        $username: String!
        $password: String!
    ) {
        login(
            username: $username password: $password
        ){
            id
            email 
            username
            createdAt
            token
        }
    }
`

export default Login;
