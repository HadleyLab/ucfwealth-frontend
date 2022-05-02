import { Layout, Form, Row, Col, Alert, Button, Card } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { FORM_ERROR } from 'final-form';
import _ from 'lodash';
import React from 'react';
import { Link } from 'react-router-dom';

import { isSuccess } from 'aidbox-react/src/libs/remoteData';
import { Token } from 'aidbox-react/src/services/token';

import { CustomForm } from 'src/components/CustomForm';
import { InputField } from 'src/components/fields';
import { signin, SigninBody } from 'src/services/auth';

import validate from './validation';

import './styles.css';

interface LoginProps {
    setToken: (token: Token) => void;
}

export function Login({ setToken }: LoginProps) {
    async function onSubmit(values: SigninBody) {
        const response = await signin(values);
        if (isSuccess(response)) {
            setToken(response.data);
        } else {
            let error = 'Wrong credentials';
            if (_.isString(response.error)) {
                error = response.error;
            } else if (_.get(response.error, 'error_description')) {
                error = response.error.error_description;
            }
            return { [FORM_ERROR]: error };
        }
        return;
    }

    const formItemLayout = {
        labelCol: {
            xs: { span: 2 },
            sm: { span: 5 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 },
        },
    };
    const tailFormItemLayout = {
        wrapperCol: {
            xs: {
                span: 24,
                offset: 0,
            },
            sm: {
                span: 16,
                offset: 5,
            },
        },
    };

    return (
        <Layout className="layout">
            <Content>
                <Row style={{ height: '100vh' }}>
                    <Col xs={{ span: 24, offset: 0 }} lg={{ span: 12, offset: 6 }}>
                        <Card style={{ marginTop: '10%', paddingTop: '15px' }}>
                            <CustomForm<SigninBody>
                                onSubmit={onSubmit}
                                validate={validate}
                                formItemLayout={formItemLayout}
                            >
                                {({ submitError, submitting }) => (
                                    <>
                                        <Form.Item {...tailFormItemLayout}>
                                            <h1>Login</h1>
                                        </Form.Item>
                                        <InputField
                                            name="email"
                                            placeholder="Email"
                                            label="Email"
                                        />
                                        <InputField
                                            name="password"
                                            placeholder="Password"
                                            label="Password"
                                            type="password"
                                        />

                                        {submitError ? (
                                            <Form.Item {...tailFormItemLayout}>
                                                <div className="signInAlertText">
                                                    <Alert message={submitError} type="error" />
                                                </div>
                                            </Form.Item>
                                        ) : null}

                                        <Form.Item {...tailFormItemLayout}>
                                            <Row>
                                                <Col>
                                                    <Button
                                                        type="primary"
                                                        htmlType="submit"
                                                        disabled={submitting}
                                                        loading={submitting}
                                                    >
                                                        Login
                                                    </Button>
                                                </Col>
                                                <Col className="signLinkContainer">
                                                    <Link to="/signup" className="signup">
                                                        Sign Up
                                                    </Link>
                                                </Col>
                                            </Row>

                                            {/*<br />*/}
                                            {/*<Link to="/reset-password">Forgot password?</Link>*/}
                                        </Form.Item>
                                    </>
                                )}
                            </CustomForm>
                        </Card>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
}
