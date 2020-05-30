import React, { useState, useContext } from 'react'
import { Form, Button } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import { AuthContext } from '../context/auth';
import { useForm } from '../util/hooks';

function Register(props) {
    
    const context = useContext(AuthContext);

    const [ errors, setErrors ] = useState({});
    const initialState = {
        username: '',
        password: '',
        email: '',
        confirmPassword: ''
    };

    const registerUser = () => {
        addUser();
    }

    const { onChange, onSubmit, values } = useForm(registerUser, initialState);
    
    const [addUser, { loading }] = useMutation(REGISTER_USER, {
        update(proxy, { data: { register: userData } }){
            context.login(userData);
            props.history.push('/');
        },
        variables: values,
        onError(err){
            setErrors(err.graphQLErrors[0].extensions.exception.errors);
        }
    });

    return (
        <div style={{width: '400px', margin: 'auto'}}>
            <Form onSubmit={onSubmit} noValidate className={loading ? 'loading': ''}>
                <h1>Register</h1>
                <Form.Input
                    label="Username"
                    placeholder="Username..."
                    name="username"
                    error={errors.username ? true : false}
                    value={values.username}
                    onChange={onChange} 
                />
                <Form.Input
                    label="Email"
                    placeholder="Email..."
                    name="email"
                    error={errors.email ? true : false}
                    type="email"
                    value={values.email}
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
                <Form.Input
                    label="Confirm password"
                    placeholder="Confirm Password..."
                    name="confirmPassword"
                    error={errors.confirmPassword ? true : false}
                    type="password"
                    value={values.confirmPassword}
                    onChange={onChange} 
                />
                <Button type="submit" primary>
                    Register
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

const REGISTER_USER = gql`
    mutation register(
        $username: String!
        $email: String!
        $password: String!
        $confirmPassword: String!
    ) {
        register(
            registerInput: {
                username: $username
                email: $email
                password: $password
                confirmPassword: $confirmPassword
            }
        ){
            id
            email 
            username
            createdAt
            token
        }
    }
`

export default Register
