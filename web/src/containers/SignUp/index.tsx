import { Alert, Button, Card, Col, Form, Layout, Row } from 'antd';
import { Content } from 'antd/es/layout/layout';
import React from 'react';
import { Link } from 'react-router-dom';

import { CustomForm } from 'src/components/CustomForm';
import { InputField } from 'src/components/fields';
import { SignupBody } from 'src/services/auth';

import validate from './validation';

interface SignUpProps {}

export function SignUp({}: SignUpProps) {
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
                            <CustomForm<SignupBody>
                                onSubmit={console.log}
                                validate={validate}
                                formItemLayout={formItemLayout}
                            >
                                {({ submitError, submitting }) => (
                                    <>
                                        <Form.Item {...tailFormItemLayout}>
                                            <h1>Sign Up</h1>
                                        </Form.Item>
                                        <InputField
                                            name="firstName"
                                            placeholder="First Name"
                                            label="First Name"
                                        />
                                        <InputField
                                            name="lastName"
                                            placeholder="Last Name"
                                            label="Last Name"
                                        />
                                        <InputField
                                            name="birthDate"
                                            placeholder="Birth Date"
                                            label="Birth Date"
                                        />
                                        <InputField
                                            name="gender"
                                            placeholder="Gender"
                                            label="Gender"
                                        />
                                        <InputField name="ssn" placeholder="SSN" label="SSN" />
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
                                                <Alert message={submitError} type="error" />
                                            </Form.Item>
                                        ) : null}

                                        <Form.Item {...tailFormItemLayout}>
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                disabled={submitting}
                                                loading={submitting}
                                            >
                                                Sign Up
                                            </Button>
                                            {'  '}
                                            <Link to="/login">Log In</Link>
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
